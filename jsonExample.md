## Input:
{
  "email": "mario.rossi@example.com",
  "password": "password123"
}

## Output:
{
  "nome": "Mario",
  "cognome": "Rossi",
  "data_di_nascita": "1985-03-12",
  "voli_prenotati": [
    {
      "codice_volo": "AZ1234",
      "data_partenza": "2024-10-05T08:30:00",
      "data_arrivo": "2024-10-05T11:15:00",
      "luogo_partenza": "Roma Fiumicino (FCO)",
      "luogo_arrivo": "Milano Malpensa (MXP)"
    },
    {
      "codice_volo": "LH5678",
      "data_partenza": "2024-12-20T15:45:00",
      "data_arrivo": "2024-12-20T18:20:00",
      "luogo_partenza": "Milano Malpensa (MXP)",
      "luogo_arrivo": "Francoforte (FRA)"
    }
  ]
}


## Input:
{
  "email": "giulia.bianchi@example.com",
  "password": "securePass!456"
}

## Output:
{
  "nome": "Giulia",
  "cognome": "Bianchi",
  "data_di_nascita": "1992-07-22",
  "voli_prenotati": [
    {
      "codice_volo": "BA9012",
      "data_partenza": "2024-11-15T10:10:00",
      "data_arrivo": "2024-11-15T13:30:00",
      "luogo_partenza": "Londra Heathrow (LHR)",
      "luogo_arrivo": "New York JFK (JFK)"
    },
    {
      "codice_volo": "AF3456",
      "data_partenza": "2024-12-01T18:00:00",
      "data_arrivo": "2024-12-01T22:45:00",
      "luogo_partenza": "Parigi Charles de Gaulle (CDG)",
      "luogo_arrivo": "Tokyo Narita (NRT)"
    }
  ]
}
