import { NextResponse } from "next/server";
import fetch from "node-fetch";
import jsdom from "jsdom";

export async function POST(request: Request) {
  const req = await request.json();
  const url = req.url;

  try {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new jsdom.JSDOM(html);
    const document = dom.window.document;

    return NextResponse.json({
      title: getTitle(document),
      metaDescription: getMetaDescription(document),
      image: getImage(document),
    });
  } catch (error) {
    return NextResponse.error();
  }
}

function getMetaDescription(document: Document) {
  return (
    document
      .querySelector("meta[name='description']")
      ?.getAttribute("content") ?? undefined
  );
}

function getTitle(document: Document) {
  return document.querySelector("title")?.text;
}

function getImage(document: Document) {
  const imageOg =
    document
      .querySelector("meta[property='og:image']")
      ?.getAttribute("content") ?? undefined;
  const imageTwitter =
    document
      .querySelector("meta[name='twitter:image']")
      ?.getAttribute("content") ?? undefined;

  let allImg: string[] = [];

  document.querySelectorAll("img").forEach((img) => {
    const imgSrc = img.getAttribute("src");
    if (imgSrc) {
      allImg.push(imgSrc);
    }
  });

  return imageOg ?? imageTwitter ?? allImg[0];
}
