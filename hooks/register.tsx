import type { Register } from 'claude-code'

// Mod di prova. Non legge file, non usa la rete, non conserva dati.
// Verifica quattro cose: disegno nella conversazione, contesto aggiunto
// al prompt, blocco di un comando, comando slash.

const BLOCK_MARKER = 'vivaio-block-test'
const SIGNATURE = 'Vivaio · test'

export const register: Register = on => {
  let prompts = 0
  let blocks = 0

  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'vivaio-test',
      description: 'Mostra lo stato della mod di prova Vivaio',
    })

    return next(e)
  })

  on('command.run', { command: 'vivaio-test' }, async () => ({
    text: [
      `${SIGNATURE}: la mod è attiva.`,
      `Prompt visti in questa sessione: ${prompts}.`,
      `Comandi bloccati in questa sessione: ${blocks}.`,
      `Per provare il blocco, chiedi all'agente di eseguire: echo ${BLOCK_MARKER}`,
    ].join('\n'),
  }))

  // 1. Contesto aggiunto al prompt: il modello lo legge, la persona no.
  on('prompt.submit', ($, e, next) => {
    if (e.command !== undefined || e.isMeta === true) {
      return next(e)
    }

    prompts += 1
    const note = `[${SIGNATURE}] Nota di contesto aggiunta dalla mod di prova. Non richiede azioni.`

    return next({ ...e, context: [...(e.context ?? []), note] })
  }).catch(($, e, next) => (next.called ? next(e) : next(e)))

  // 2. Blocco di un comando innocuo, con regola, motivo e cosa fare.
  on('tool.call', { tool: 'Bash' }, ($, e, next) => {
    if (!e.command.includes(BLOCK_MARKER)) {
      return next(e)
    }

    blocks += 1

    return {
      deny: `${SIGNATURE}: comando bloccato dalla regola di prova «${BLOCK_MARKER}». Il blocco serve solo a verificare che la mod funzioni. Non serve fare nulla.`,
    }
  }).catch(($, e, next) => next(e))

  // 3. Riquadro firmato sotto ogni messaggio scritto dalla persona.
  on('ui.render', { component: 'UserMessage' }, async ($, e, next) => {
    if (e.props.origin.kind !== 'composer') {
      return next(e)
    }

    const { Box, Text } = $.ui.resolve(e)
    const row = await next(e)

    return (
      <Box flexDirection="column">
        {row}
        <Box borderStyle="quote" borderColor="green" paddingLeft={1}>
          <Text bold color="green">
            {SIGNATURE}
          </Text>
          <Text> La mod è attiva: questo riquadro lo disegna la mod.</Text>
        </Box>
      </Box>
    )
  })
}
