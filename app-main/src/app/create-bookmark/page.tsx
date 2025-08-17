"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import LinkInput from "@/components/specific/Bookmark/CreateBookmark/LinkInput";
import BookmarkInput from "@/components/specific/Bookmark/CreateBookmark/BookmarkInput";

const cleanUrl = (url: string): string => {
  let cleanedUrl = url.trim();
  
  console.log("Nettoyage de l'URL:", cleanedUrl);
  
  if (cleanedUrl.startsWith("https://app.mosalink.com/")) {
    cleanedUrl = cleanedUrl.replace("https://app.mosalink.com/", "");
    console.log("Après suppression du préfixe mosalink:", cleanedUrl);
  }
  
  const trackingPatterns = [
    /(\?|&)utm_source=.*?share\.google\.com.*$/,
    /(\?|&)utm_[^&]*=[^&]*/g,
    /(\?|&)fbclid=[^&]*/g,
    /(\?|&)gclid=[^&]*/g,
  ];
  
  trackingPatterns.forEach(pattern => {
    cleanedUrl = cleanedUrl.replace(pattern, "");
  });
  
  cleanedUrl = cleanedUrl.replace(/[\?&]+$/, "");
  
  console.log("Après suppression des trackers:", cleanedUrl);
  
  if (!cleanedUrl.startsWith("http://") && !cleanedUrl.startsWith("https://")) {
    cleanedUrl = "https://" + cleanedUrl;
    console.log("Après ajout du protocole:", cleanedUrl);
  }
  
  return cleanedUrl;
};

const CreateBookmark = () => {
  const searchParams = useSearchParams();
  const [url, setUrl] = useState<null | string>(null);
  const [sharedTitle, setSharedTitle] = useState<string | null>(null);
  const [sharedDescription, setSharedDescription] = useState<string | null>(null);

  useEffect(() => {
    const allParams = Array.from(searchParams.entries());
    console.log("Paramètres reçus:", allParams);
    
    const titleParam = searchParams.get("name");
    if (titleParam) {
      console.log("Titre partagé:", titleParam);
      setSharedTitle(titleParam);
    }
    
    const descriptionParam = searchParams.get("description");
    if (descriptionParam && !descriptionParam.startsWith("http")) {
      console.log("Description partagée:", descriptionParam);
      setSharedDescription(descriptionParam);
    }
    
    const linkParam = searchParams.get("link");
    const urlParam = searchParams.get("url");
    const descParam = searchParams.get("description");
    
    const rawUrl = linkParam || urlParam || (descParam && descParam.startsWith("http") ? descParam : null);
    
    console.log("URL brute reçue:", rawUrl);
    
    if (rawUrl) {
      const cleanedUrl = cleanUrl(rawUrl);
      console.log("URL nettoyée:", cleanedUrl);
      setUrl(cleanedUrl);
    }
  }, [searchParams]);

  const stepContent = useMemo(() => {
    if (!url) {
      return <LinkInput setUrl={setUrl} />;
    }
    return (
      <BookmarkInput 
        url={url} 
        setUrl={setUrl} 
        initialTitle={sharedTitle}
        initialDescription={sharedDescription}
      />
    );
  }, [url, sharedTitle, sharedDescription]);

  return (
    <div className="flex flex-col items-center gap-8 md:gap-20 py-8 md:py-40 px-4 md:px-40">
      <h1 className="text-xl md:text-2xl text-center font-bold">Insérer un lien</h1>
      {stepContent}
    </div>
  );
};

export default CreateBookmark;
