"use strict";
// Considere um modelo de informação, onde um registro é representado por uma "tupla".
// Uma tupla (ou lista) nesse contexto é chamado de fato.

// Exemplo de um fato:
// ('joão', 'idade', 18, true)

// Nessa representação, a entidade 'joão' tem o atributo 'idade' com o valor '18'.

// Para indicar a remoção (ou retração) de uma informação, o quarto elemento da tupla pode ser 'false'
// para representar que a entidade não tem mais aquele valor associado aquele atributo.


// Como é comum em um modelo de entidades, os atributos de uma entidade pode ter cardinalidade 1 ou N (muitos).

// Segue um exemplo de fatos no formato de tuplas (E, A, V, added?)
// i.e. [entidade, atributo, valor, booleano indica se fato foi adicionado ou retraido)

var facts = [
  ['gabriel', 'endereço', 'av rio branco, 109', true],
  ['joão', 'endereço', 'rua alice, 10', true],
  ['joão', 'endereço', 'rua bob, 88', true],
  ['joão', 'telefone', '234-5678', true],
  ['joão', 'telefone', '91234-5555', true],
  ['joão', 'telefone', '234-5678', false],
  ['gabriel', 'telefone', '98888-1111', true],
  ['gabriel', 'telefone', '56789-1010', true],
];

// Vamos assumir que essa lista de fatos está ordenada dos mais antigos para os mais recentes.

// Nesse schema,
// o atributo 'telefone' tem cardinalidade 'muitos' (one-to-many), e 'endereço' é 'one-to-one'.
var schema = [
    ['endereço', 'cardinality', 'one'],
    ['telefone', 'cardinality', 'many']
];


// Nesse exemplo, os seguintes registros representam o histórico de endereços que joão já teve:
//  [
//   ['joão', 'endereço', 'rua alice, 10', true]
//   ['joão', 'endereço', 'rua bob, 88', true],
//]
// E o fato considerado vigente é o último.

// O objetivo desse desafio é escrever uma função que retorne quais são os fatos vigentes sobre essas entidades.
// Ou seja, quais são as informações que estão valendo no momento atual.
// A função deve receber `facts` (todos fatos conhecidos) e `schema` como argumentos.

// Resultado esperado para este exemplo (mas não precisa ser nessa ordem):
[
  ['gabriel', 'endereço', 'av rio branco, 109', true],
  ['joão', 'endereço', 'rua bob, 88', true],
  ['joão', 'telefone', '91234-5555', true],
  ['gabriel', 'telefone', '98888-1111', true],
  ['gabriel', 'telefone', '56789-1010', true]
];

function activeFacts(facts, schema) {

  var bag = (function(schema) {
    var content = [];
    var hasKey = [];
    var constraints = [];

    for (var i = 0; i < schema.length; i++) {
      constraints[schema[i][0]] = schema[i][2];
    }

    function _replace(value) {
      for (var i = 0; i < content.length; i++) {
        if (content[i][0] === value[0] && content[i][1] === value[1]) {
          content[i] = value;
          return;
        }
      }
    }

    function _add(value) {
      var shouldAdd = true;
      var type = value[1];
      var key = value[0] + "-" + value[1];

      if (hasKey[key] !== undefined && hasKey[key] !== null && constraints[type] === 'one') {
        shouldAdd = false;
      }

      if (shouldAdd) {
        content.push(value);
        hasKey[key] = true;
      } else {
        _replace(value);
      }

    }

    function _get() {
      return content;
    }

    return {
      add: _add,
      get: _get
    }

  })(schema);

  for (var i = 0; i < facts.length; i++) {
    if (facts[i][3]) {
      bag.add(facts[i]);
    }
  }
  return bag.get();
};

var af = activeFacts(facts, schema);
console.log(af);

