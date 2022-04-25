"use strict";

import { verify } from "jsonwebtoken";
import { db } from "../../db";
import { gc } from "../../gc";

/**
 * @param {*} cookie Serialized cookie, without name prefix.
 * @returns claims object containing all member claims. Upon no cookie or error, values will be empty strings.
 */
export function getMemberClaims(cookie) {
    let claims = {
        permission: null,
        email: null,
        id: null
    };

    if (!cookie) return claims;

    verify(cookie, process.env.JWT_SECRET, function (err, decoded) {       
        if (!err && decoded) {
            claims = {
                permission: decoded.permission,
                email: decoded.memberEmail,
                id: decoded.sub
            }
        }
    });

    return claims;
}

export async function deleteUser(member) {
    if (member) {
        const documents = await db("documents").where("owner", member.member_id);
        const organisations = await db("organisations").where("fk_leader", member.member_id);

        documents.forEach( async doc => {
            try {
                await gc.file(doc.filename).delete();
            }
            catch (error) {
                console.error(error);
            }
        });

        if (organisations) {
            for (let i = 0; i < organisations.length; i++) {
                await db("members_organisations").where("organisation_id", organisations.at(i).organisation_id).del();
            }
        }

        await db("documents").where("owner", member.member_id).del();
        await db("password_reset").where("email", member.email).del();
        await db("members_organisations").where("member_id", member.member_id).del();
        await db("organisations").where("fk_leader", member.member_id).del();
        await db("members").where("member_id", member.member_id).del();
    }
}