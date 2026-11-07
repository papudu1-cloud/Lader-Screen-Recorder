# Lader Screen Recorder

Aplicação web para gravar um ecrã, janela ou separador escolhido pelo utilizador.

## Executar
- Abra `index.html` num navegador moderno.
- Para melhor compatibilidade, publique em HTTPS (por exemplo, GitHub Pages) ou execute num servidor local.
- Clique em **Iniciar gravação** e escolha o conteúdo na janela de partilha do navegador.
- Clique em **Parar** e depois em **Descarregar gravação**.

## Compatibilidade e privacidade
A captura usa `getDisplayMedia()` e `MediaRecorder`. O navegador exige uma ação explícita do utilizador e pode limitar a captura de áudio conforme o sistema e a opção escolhida. O conteúdo é processado localmente; esta aplicação não envia gravações para um servidor.

## Formato
A saída é WebM. A conversão para MP4 não está incluída.

## Estrutura extra
Os ficheiros CONFIG, OPTION, INI e MUI documentam as opções próprias deste projeto. Os diretórios de ferramentas auxiliares estão descritos em `ARQUIVOS.md`.
