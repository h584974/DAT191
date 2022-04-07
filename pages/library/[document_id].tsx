"use strict";

import Header from "../../components/header";
import dynamic from "next/dynamic";
import { server } from "../../next.config";
import { useState } from "react";

const PDFViewer = dynamic(() => import("../../components/pdf-viewer"), {
  ssr: false
});

export default function DocumentPage({ isCookie, doc }) {
  const [fetching, setFetching] = useState(false);
  const [file, setFile] = useState(null);

  if (!fetching) {
    setFetching(true);
    fetch(`${server}/api/library/file?filepath=${doc.filepath}&public=${doc.public}&owner=${doc.owner}`, { method: "GET" })
    .then(res => res.json())
    .then(data => {
      const { error, file } = data;
      if (!error) setFile(file);
    });
  }

  return (
    <>
    {Header(isCookie)}
    <PDFViewer file={file}/>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const cookie = ctx.req?.headers.cookie;
  const isCookie = cookie ? true : false;

  const res = await fetch(`${server}/api/library/${ctx.query.document_id}`, {
    method: "GET",
    headers: { cookie: cookie }
  });
  const { doc, error } = await res.json();

  if (error || !doc) {
    return { redirect: { destination: "/library", permanent: false } }
  }

  return { props: { isCookie, doc } };
}