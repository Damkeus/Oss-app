import { IEmployee } from "../types";

/**
 * Liste OSS réelle (extrait Excel fourni — Zone / Country / Location / Firstname / Lastname / TRIGRAM).
 * Données conservées fidèlement (y compris coquilles d'origine : "Normay", "Lebonon",
 * "Ivoy Coast", "UEA", ligne 23 dont le Country est mal renseigné). Le nettoyage est fait
 * en aval (mapping pays/coordonnées tolérant) — voir data/siteCoords.ts.
 *
 * À synchroniser avec la future DB OSS / Dataverse.
 */
export const mockEmployees: IEmployee[] = [
  { Zone: "Zone Corp", Country: "France", Location: "Puteaux", Firstname: "Romain", Lastname: "CHALUMEAU", TRIGRAM: "RCU" },
  { Zone: "Zone Corp", Country: "France", Location: "Puteaux", Firstname: "Lilian", Lastname: "MEUNIER", TRIGRAM: "LMR" },
  { Zone: "Zone Corp", Country: "France", Location: "Lens", Firstname: "Alain", Lastname: "TAQUET", TRIGRAM: "ATT" },
  { Zone: "Zone Euro", Country: "France", Location: "Puteaux", Firstname: "Lionel", Lastname: "MONCLER", TRIGRAM: "LMR" },
  { Zone: "Zone Euro", Country: "France", Location: "Puteaux", Firstname: "Sebastien", Lastname: "REGNIER", TRIGRAM: "SRR" },
  { Zone: "Zone Euro", Country: "France", Location: "Puteaux", Firstname: "Kofi", Lastname: "CUMMINGS", TRIGRAM: "KCS" },
  { Zone: "Zone Euro", Country: "France", Location: "Puteaux", Firstname: "Serge", Lastname: "AFOGNON", TRIGRAM: "SAN" },
  { Zone: "Zone Euro", Country: "France", Location: "Donchery/Jeumont/Plainfaing", Firstname: "Thibaut", Lastname: "DARDART", TRIGRAM: "TDT" },
  { Zone: "Zone Euro", Country: "France", Location: "Lens/DOUR/Bohain", Firstname: "Pascal", Lastname: "HUGOT", TRIGRAM: "PHT" },
  { Zone: "Zone Euro", Country: "France", Location: "Lyon SOLARIS", Firstname: "Vincent", Lastname: "BLANCHARD", TRIGRAM: "VBD" },
  { Zone: "Zone Euro", Country: "France", Location: "La Verp/Lyon Ampacity", Firstname: "Maxence", Lastname: "DELACROIX", TRIGRAM: "MDX" },
  { Zone: "Zone Euro", Country: "Belgium", Location: "Charleroi/CALAIS", Firstname: "Youssef", Lastname: "EL OUAHMANI", TRIGRAM: "YEI" },
  { Zone: "Zone Euro", Country: "CZ", Location: "Cheb/Raciborz", Firstname: "Jaroslav", Lastname: "MURAS", TRIGRAM: "JMS" },
  { Zone: "Zone Euro", Country: "Finland", Location: "Hyvinkaa/Keuruu/Riihimaki", Firstname: "Tarja", Lastname: "KYOSTILA", TRIGRAM: "TKA" },
  { Zone: "Zone Euro", Country: "Finland", Location: "Hyvinkaa/Keuruu/Riihimaki", Firstname: "Tomi", Lastname: "LEPISTO", TRIGRAM: "TLO" },
  { Zone: "Zone Euro", Country: "France", Location: "Autun/Bourg", Firstname: "Guillaume", Lastname: "Valery", TRIGRAM: "GVY" },
  { Zone: "Zone Euro", Country: "GS_EU", Location: "Courbevoie/Nanterre", Firstname: "Serge", Lastname: "AFFOGNON", TRIGRAM: "SAN" },
  { Zone: "Zone Euro", Country: "Germany", Location: "Hannover", Firstname: "Fadi", Lastname: "DAUD", TRIGRAM: "FDD" },
  { Zone: "Zone Euro", Country: "Germany", Location: "HOF/Essen", Firstname: "Thomas", Lastname: "EICHHORN", TRIGRAM: "TEN" },
  { Zone: "Zone Euro", Country: "Greece", Location: "Lamia/Rentis", Firstname: "Efthymios", Lastname: "Kougias", TRIGRAM: "EKS" },
  { Zone: "Zone Euro", Country: "Italy", Location: "Battipaglia/Offida/Latina/Milano", Firstname: "Filippo", Lastname: "BOTTONE", TRIGRAM: "FBE" },
  { Zone: "Zone Euro", Country: "Italy", Location: "LTC/Brendola/Montecchio/Tolentino", Firstname: "Sadjo", Lastname: "PEGUY NYA", TRIGRAM: "SPA" },
  { Zone: "Zone Euro", Country: "LTC/Brendola/Montecchio/Tolentino", Location: "LTC/Brendola/Montecchio/Tolentino", Firstname: "Daniele", Lastname: "CORTIVO", TRIGRAM: "DCO" },
  { Zone: "Zone Euro", Country: "Normay", Location: "Halden/Fredrikstad", Firstname: "Daniel", Lastname: "NILSEN", TRIGRAM: "DNN" },
  { Zone: "Zone Euro", Country: "Norway", Location: "Halden/Fredrikstad", Firstname: "Ramal", Lastname: "AFZAL", TRIGRAM: "RAL" },
  { Zone: "Zone Euro", Country: "Norway", Location: "Halden/Fredrikstad", Firstname: "Espen", Lastname: "BERGSTROM", TRIGRAM: "EBM" },
  { Zone: "Zone Euro", Country: "Norway", Location: "Langhus", Firstname: "Nasar", Lastname: "SHARIF", TRIGRAM: "NSF" },
  { Zone: "Zone Euro", Country: "Norway", Location: "Oslo/Kjeller/Sandjeford", Firstname: "Christy", Lastname: "AKSELSEN", TRIGRAM: "CAN" },
  { Zone: "Zone Euro", Country: "Norway", Location: "Oslo/Kjeller/Sandjeford", Firstname: "Mohamed", Lastname: "HASSAN", TRIGRAM: "MHN" },
  { Zone: "Zone Euro", Country: "Norway", Location: "Rognan", Firstname: "Jon", Lastname: "Bodker", TRIGRAM: "JBR" },
  { Zone: "Zone Euro", Country: "Norway", Location: "Rognan", Firstname: "Roy", Lastname: "KRISTENSEN", TRIGRAM: "RKN" },
  { Zone: "Zone Euro", Country: "Spain", Location: "All the Sites", Firstname: "Carlos", Lastname: "Robles", TRIGRAM: "CRS" },
  { Zone: "Zone Euro", Country: "Spain", Location: "All the Sites", Firstname: "Soportespain SI", Lastname: "soportespain.si", TRIGRAM: "SSI" },
  { Zone: "Zone Euro", Country: "Suisse", Location: "Cortaillod", Firstname: "Camille", Lastname: "ABESSOU", TRIGRAM: "CAU" },
  { Zone: "Zone Euro", Country: "Sweden", Location: "Grimsas/Gislaved", Firstname: "Ben", Lastname: "DALE", TRIGRAM: "BDE" },
  { Zone: "Zone Euro", Country: "Sweden", Location: "Grimsas/Gislaved", Firstname: "Mats", Lastname: "LORENTSZON", TRIGRAM: "MLN" },
  { Zone: "Zone Euro", Country: "UK", Location: "Milton Keynes/Edinburg/Castleford", Firstname: "Alan", Lastname: "JONES", TRIGRAM: "AJS" },
  { Zone: "Zone Euro", Country: "UK", Location: "Milton Keynes/Edinburg/Castleford", Firstname: "Stuart", Lastname: "DOUBELL", TRIGRAM: "SDL" },
  { Zone: "Zone MERA", Country: "Ghana", Location: "TEMA", Firstname: "Nana Yaw", Lastname: "ADJEI", TRIGRAM: "NAI" },
  { Zone: "Zone MERA", Country: "Ghana", Location: "TEMA", Firstname: "Kinsgley", Lastname: "ATADANA", TRIGRAM: "KAA" },
  { Zone: "Zone MERA", Country: "Ivoy Coast", Location: "Abidjan", Firstname: "Kalifa", Lastname: "BAMBA", TRIGRAM: "KBA" },
  { Zone: "Zone MERA", Country: "Lebonon", Location: "Beyrouth/Nahr Ibrahim", Firstname: "Carla", Lastname: "NADER", TRIGRAM: "CNR" },
  { Zone: "Zone MERA", Country: "Morocco", Location: "Casablanca", Firstname: "Khalid", Lastname: "MALKI", TRIGRAM: "KMI" },
  { Zone: "Zone MERA", Country: "Morocco", Location: "Mohamedia", Firstname: "El Mehdi", Lastname: "BENCHRIF", TRIGRAM: "EBF" },
  { Zone: "Zone MERA", Country: "Qatar/UEA", Location: "Maseed/Dubai", Firstname: "Yasar", Lastname: "THEKKAVIL", TRIGRAM: "YTL" },
  { Zone: "Zone MERA", Country: "Turkey", Location: "Denizli", Firstname: "Nail", Lastname: "ALTUN", TRIGRAM: "NAN" },
  { Zone: "Zone Euro", Country: "Belgium", Location: "Erembodegem/Buizingen/Ukkle/Schiedam", Firstname: "Felipe", Lastname: "VARA", TRIGRAM: "FVA" },
];
