# Acesso do professor

O painel de diagnóstico é uma área restrita. O portal público não exibe respostas individuais.

## Acesso

1. Abra a **Área do professor** no portal.
2. Clique em **Entrar com GitHub**.
3. Autorize o aplicativo usando a mesma conta GitHub vinculada ao seu acesso.
4. O backend valida o usuário autenticado e libera o resumo somente para uma conta autorizada como professor.

O login do portal usa **GitHub OAuth** pelo Supabase Auth. Não é necessário criar ou memorizar uma senha específica para o portal.

## Autorização do professor

A autenticação pelo GitHub identifica o usuário. A autorização é mantida separadamente no backend por meio do campo seguro de `app_metadata`:

```json
{"role":"teacher"}
```

A função de backend exige `app_metadata.role = teacher` antes de entregar o resumo.

## Configuração inicial do GitHub

No Supabase, o provedor **GitHub** precisa estar habilitado em Authentication → Providers.

O callback usado pelo provedor é:

```text
https://xspycvmgdlsighbvztfl.supabase.co/auth/v1/callback
```

Na configuração de URLs do Supabase Auth, o endereço de retorno do portal também deve ser permitido:

```text
https://sayjinblackbelt.github.io/26_Digital_Inclusion/professor/
```

## Dados exibidos

O painel apresenta apenas indicadores agregados, como:

- quantidade de respostas;
- média de autonomia percebida;
- percentual de nível baixo por competência;
- ferramenta mais indicada pela turma.

Não são exibidos nomes, e-mails dos participantes, respostas individuais ou textos identificáveis.

## Importante

Nunca colocar senha, client secret do GitHub, chave secreta ou `service_role` no GitHub Pages. O navegador usa somente a chave pública do projeto.
