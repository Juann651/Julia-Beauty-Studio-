# Julia Beauty Studio

Site de um salão de beleza em Vila Velha - ES. Apresenta os serviços (cabelo, olhar, estética, maquiagem e noivas) e permite **agendar o horário online** em 4 passos, com um painel administrativo para a profissional.

Feito com **HTML, CSS e JavaScript puro**, sem framework e sem etapa de build.

## Funcionalidades

**Para a cliente**
- Apresentação do studio e das categorias de serviço, com fotos
- Agendamento em 4 passos: serviço, data e horário, dados de contato e confirmação
- Calendário com bloqueio de datas passadas e de horários já reservados
- Código do agendamento (formato `JB-0000`) e resumo da reserva
- Depoimentos, localização e contato

**Para a profissional (painel administrativo)**
- Acesso por senha
- Lista de agendamentos com busca e filtro por status
- Alteração de status: pendente, confirmado, concluído ou cancelado

## Serviços

Cabelo (chapinha, escova, hidratação, coloração, luzes, progressiva e penteados), olhar (sobrancelha, henna e cílios), estética (limpeza de pele, massagem, drenagem e depilação), maquiagem e noivas. Serviços, durações, preços ("A consultar" quando varia) e horários ficam no topo do `script.js` (`CATS`, `SVCS` e `SLOTS`).

## Estrutura

```
Julia-Beauty-Studio/
├── index.html    # página única (site, agendamento e painel)
├── style.css     # estilos
├── script.js     # calendário, horários, agendamento e painel
├── config.js     # configuração pública (sem a senha)
├── config.example.js
├── build-config.js  # gera config.local.js a partir de variável de ambiente
├── vercel.json   # configuração de deploy na Vercel
└── imagens/      # fotos do salão e dos serviços
```

## Como rodar

Não precisa instalar nada. Abra a pasta no VS Code e rode o `index.html` com a extensão **Live Server**, ou abra o arquivo direto no navegador.

## Senha do painel e deploy

**Localmente:** copie `config.example.js` para `config.local.js` e coloque sua senha em `ADMIN_SENHA`.

**Na Vercel:** importe o repositório (Framework Preset: **Other**), cadastre a variável `ADMIN_SENHA` em Settings → Environment Variables e faça o deploy. O `build-config.js` gera o `config.local.js` automaticamente. Se a variável faltar, o build falha e avisa.

## Personalização

- **Senha do painel:** não fica no repositório. Ela vem de `config.local.js` (ignorado pelo Git) e, na Vercel, da variável de ambiente `ADMIN_SENHA` (veja a seção abaixo). Sem senha configurada, o painel não abre.
- **Serviços e horários:** `CATS`, `SVCS` e `SLOTS` no `script.js`.
- **Contatos e redes sociais:** links no `index.html`.

## Limitações

Este é um projeto 100% front-end, sem servidor nem banco de dados:
- Os agendamentos ficam no **localStorage do navegador**. Eles não são compartilhados entre dispositivos, então um horário reservado por uma cliente não aparece como ocupado para outra pessoa, nem no painel de outro computador.
- A senha do painel está no código e pode ser lida por quem inspecionar o site. Ela **não é uma proteção real**.

Para uso em produção, o agendamento e o painel precisam de um back-end com banco de dados (por exemplo, Supabase ou Firebase).
