# Seed Database - Dados Iniciais

Este arquivo contém instruções para popular o banco de dados com medicamentos e vacinas iniciais.

## Como usar

### Opção 1: Executar o script de seed

```bash
cd backend-clinica-veterinaria-v2
npm run seed
```

### Opção 2: Executar manualmente

```bash
cd backend-clinica-veterinaria-v2
node seed.js
```

## O que é adicionado

### Medicamentos (6 itens)
- **Amoxicilina** - Antibiótico oral
- **Dipirona Sódica** - Analgésico oral
- **Cefalexina** - Antibiótico oral
- **Insulina** - Hormônio injetável
- **Penicilina Benzatina** - Antibiótico injetável
- **Metronidazol** - Antiparasitário oral

### Vacinas (6 itens)
- **V10 (Polivalente)** - Para cães
- **Raiva** - Para cães
- **V8 (Polivalente Felina)** - Para gatos
- **Raiva Felina** - Para gatos
- **Giardíase** - Para cães
- **Leucemia Felina (FeLV)** - Para gatos

## Informações Importantes

- O script verifica se os dados já existem antes de inserir
- Se já houver medicamentos/vacinas no banco, o script não duplicará
- O banco de dados deve estar funcionando e a variável `MONGO_URI` configurada no `.env`

## Resultado

Após executar o seed, a seção "Nossos Serviços" da página principal será preenchida com os itens adicionados ao banco de dados.
