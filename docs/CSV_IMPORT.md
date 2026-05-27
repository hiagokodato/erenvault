# Importação CSV — ErenVault

## Formato esperado

Arquivo `.csv` com cabeçalho na primeira linha e separador `;` ou `,`.

| Coluna (exemplos de nome) | Obrigatório | Exemplo |
|---------------------------|-------------|---------|
| Data, Date | Sim | `15/05/2026` ou `2026-05-15` |
| Descrição, Histórico | Sim | `Supermercado` |
| Valor, Amount | Sim | `-89,90` ou `1.200,00` |
| Tipo (opcional) | Não | `entrada` / `saída` |

## Regras

- Valores **negativos** → despesa; **positivos** → receita (se não houver coluna Tipo).
- Linhas sem data, descrição ou valor válido são ignoradas.
- Categoria fica em branco na importação (pode editar depois manualmente).

## Exemplo mínimo

```csv
Data;Descrição;Valor
01/05/2026;Salário;5000,00
02/05/2026;Mercado;-234,50
```

## Onde importar

**Transações** → seção **Importar CSV** → escolher arquivo → conferir prévia → importar.
