'use strict';
/*
export async function getServerSideProps ({params}) {
    return {
        props: {},
    };
}

/*
*   Database:
*   
*   PostgreSQL. But: MongoDB might be a good solution for only files.
*   PostgreSQL idea: Store link to file, and some basic, informative text(s) about the file??
*
*/

export default function Library() {
    return (
        <div>
            <p>Page for library!</p>
            <hr/>
            <div>
            </div>
        </div>
    );
}