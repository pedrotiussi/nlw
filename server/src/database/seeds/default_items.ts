import Knex from 'knex'

export async function seed (knex: Knex){
    await knex('items').insert([
        {title: 'Lâmpadas', image: 'lampas.sgv'},
        {title: 'Pilhas e Baterias', image: 'baterias.sgv'},
        {title: 'Papeis e Papelão', image: 'papeis-papelao.sgv'},
        {title: 'Resíduos Eletrônicos', image: 'eletronicos.sgv'},
        {title: 'Resíduos Orgânicos', image: 'organicos.sgv'},
        {title: 'Óleo de Cozinha', image: 'oleo.sgv'},
    ]); 
}