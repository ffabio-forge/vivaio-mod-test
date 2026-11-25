# vivaio-test

Mod di prova per Claude Code. Serve a verificare se una mod installata dall'utente si carica su una macchina aziendale gestita. Non legge file, non usa la rete e non conserva dati.

## Che cosa fa

- Disegna un riquadro firmato «Vivaio · test», con una barra verde, sotto ogni messaggio che scrivi.
- Aggiunge al prompt una breve nota di contesto, che il modello legge e tu non vedi.
- Blocca il comando innocuo `echo vivaio-block-test`, con un messaggio che spiega il blocco.
- Aggiunge il comando `/vivaio-test`, che mostra lo stato della mod.

## Installazione

Nel terminale, dentro Claude Code:

```
/plugin install vivaio-test --marketplace ffabio-forge/vivaio-mod-test
```

Dalla shell:

```bash
claude plugin install vivaio-test --marketplace ffabio-forge/vivaio-mod-test
```

Nell'app desktop: clicca + accanto al campo del prompt, poi Plugins, Add marketplace con `ffabio-forge/vivaio-mod-test`, poi Add plugin.

## Disinstallazione

```bash
claude plugin uninstall vivaio-test
```

```bash
claude plugin marketplace remove vivaio-test
```
