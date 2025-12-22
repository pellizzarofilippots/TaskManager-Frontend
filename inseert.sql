select * from wksp_taskman.utenti

INSERT INTO wksp_taskman.anagrafica 
    (genere, ind_canc, nascita, cf, cognome, nome)
VALUES
    ('M', false, '1985-06-12', 'RSSMRA85H12H501Z', 'Rossi', 'Mario')


INSERT INTO wksp_taskman.ruoli_utente (id_ruolo, nome_ruolo, descrizione)
VALUES
    (1, 'ADMIN', 'Amministratore con accesso completo al sistema')


INSERT INTO wksp_taskman.stati_utente (id_stato, etichetta, descrizione)
VALUES
    (1, 'ATTIVO', 'Utente attivo e abilitato al login')



INSERT INTO wksp_taskman.utenti
    (data_scadenza_pwd, forza_cambio_pwd, id_utente, ruolo_id, stato_utente_id, tentativi_falliti, codice_attivazione, password, userid)
VALUES
    ('2026-12-31', false, 1, 1, 1, 0, 'mario', 'test', 'mrossi')

	INSERT INTO wksp_taskman.progetti
(
    fine,
    ind_canc,
    inizio,
    mod_date,
    responsabile_id,
    nome,
    descrizione
)
VALUES
(
    '2026-12-31',          -- fine progetto
    false,                 -- ind_canc
    '2025-01-01',          -- inizio progetto (obbligatorio)
    CURRENT_DATE,          -- mod_date (usa la data corrente)
    1,                     -- responsabile_id (deve esistere in anagrafica)
    'Progetto Alpha',      -- nome progetto (obbligatorio)
    'Descrizione del progetto Alpha'  -- descrizione progetto
);

INSERT INTO wksp_taskman.ruoli_progetto
(id_ruolo, etichetta)
VALUES
(1, 'Responsabile');


	