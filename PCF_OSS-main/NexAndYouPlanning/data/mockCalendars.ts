/**
 * Calendriers mock pour dev local (PCF test harness).
 * Fournit des absences de démo visibles sur le mois courant.
 * Utilisé uniquement quand calendarJson est vide (pas connecté à Power Apps).
 */
export const MOCK_CALENDAR_JSON = JSON.stringify([
  {
    CalendrierRecupere: 1,
    NomCalendrier: "Calendrier de Romain CHALUMEAU",
    Proprietaire: "Romain CHALUMEAU",
    Evenements: [
      {
        Debut: "2026-06-02T00:00:00",
        Fin: "2026-06-08T00:00:00",
        EstAbsent: true,
        Lieu: "",
        Statut: "absent",
        Sujet: "Congés",
      },
    ],
  },
]);
