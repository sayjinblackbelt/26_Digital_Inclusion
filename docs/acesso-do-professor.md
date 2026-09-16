# Acesso do professor

O painel de diagnóstico é uma área restrita. O portal público não exibe respostas individuais.

## Configuração

1. Criar uma conta de professor em **Supabase Auth** usando e-mail e senha.
2. No usuário criado, definir em **App Metadata** o campo:

```json
{"role":"teacher"}
```

3. Acessar no portal o link **Área do professor**.
4. Entrar com a conta autorizada.

A função de backend valida o token no Supabase Auth e exige `app_metadata.role = teacher` antes de entregar o resumo.

## Dados exibidos

O painel apresenta apenas indicadores agregados, como:

- quantidade de respostas;
- média de autonomia percebida;
- percentual de nível baixo por competência;
- ferramenta mais indicada pela turma.

Não são exibidos nomes, e-mails dos participantes, respostas individuais ou textos identificáveis.

## Importante

A conta do professor é administrativa e deve usar senha forte e acesso individual. Nunca colocar senha, chave secreta ou `service_role` no GitHub Pages.
