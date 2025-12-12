select * from wksp_taskman.anagrafica

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