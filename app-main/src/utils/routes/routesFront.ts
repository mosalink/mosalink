import { Damion } from "next/font/google";

export const routeIndexFront = process.env.NEXT_PUBLIC_APP_URL;

export const routeLoginFront = routeIndexFront + "/login";

export const routeDomainFront = (domain: string) =>
  `${routeIndexFront}/${domain}`;

export const routeAdminFront = (domain: string) =>
  `${routeIndexFront}/${domain}/admin`;

export const routeCategorieFront = (domain: string, categorie: string) =>
  `${routeDomainFront(domain)}/${categorie}`;

export const routeTagFront = (domain: string, tag: string) =>
  `${routeDomainFront(domain)}/tag/${tag}`;

export const routeFolderFront = (domain: string, folder: string) =>
  `${routeDomainFront(domain)}/folder/${folder}`;

export const routeUserFront = (domain: string, user: string) =>
  `${routeDomainFront(domain)}/user/${user}`;
export const routeProfileFront = (domain: string) =>
  routeDomainFront(domain) + "/profile";

export const routeCreateBookmarkFront = (domain: string) =>
  `${routeDomainFront(domain)}/create-bookmark`;

export const routeSearchFront = (domain: string) =>
  `${routeDomainFront(domain)}/search`;

export const routeProjectFront = (projectId: string) =>
  `${routeIndexFront}/projet/${projectId}`;
