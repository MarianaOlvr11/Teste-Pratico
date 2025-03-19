$(document).ready(function() {

    var select = $('#acao');
    select.empty();
   
    let tabela = $("#tabela").DataTable({
        "language": {
            "sProcessing": "Processando...",
            "sLengthMenu": "Exibir _MENU_ registros",
            "sZeroRecords": "Nenhum registro encontrado",
            "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
            "sInfoFiltered": "(filtrado de _MAX_ registros totais)",
            "sSearch": "Pesquisar:",
            "oPaginate": {
                "sFirst": "Primeiro",
                "sPrevious": "Anterior",
                "sNext": "Próximo",
                "sLast": "Último"
            }
        },
        "autoWidth": false,
        "ajax": {
            "url": "/api/listar",
            "dataSrc": ""
        },
        "columns": [
            { "data": "acao" },
            { 
                "data": "data_prevista",
                "render": function(data) {
                    return formatarData(data);
                }
            },
            { 
                "data": "investimento",
                "type": "num", // tipo numérico para ordenação
                "render": function(data, type, row) {
                    if (type === 'sort' || type === 'type') {
                        return Number(data); 
                    }
                    return "R$ " + Number(data).toLocaleString('pt-BR', { 
                        minimumFractionDigits: 2 
                    }); // formatação 
                }
            },
            { 
                "data": "data_cadastro",
                "render": function(data) {
                    return formatarData(data);
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    return `<button class="btn btn-primary editar" data-id="${row.id}"><i class="fa fa-pencil"></i></button>`;
                }
            },
            {
                "data": null,
                "render": function(data, type, row) {
                    return `<button class="btn btn-danger excluir" data-id="${row.id}"><i class="fa fa-trash"></i></button>`;
                }
            }
        ],
        
        "initComplete": function() {
            // esconder a coluna de data de cadastro 
            tabela.column(3).visible(false);
        }
    });
    
});


    // carrega os dados 
    function init() {
        carregarTiposAcao();
        
    }




     
    $("#limpar").click(function() {
       
        $("#acao").val(""); 
        $("#data_prevista").val(""); 
        $("#investimento").val(""); 
    });
    

    // formata data dd/mm/aaaa
    function formatarData(data) {
        let dataObj = new Date(data);
        return dataObj.toLocaleDateString('pt-BR');
    }

    // ajusta a altura do espaço cinza conforme o preenchimento da tabela
    $(document).ready(function() {
        
        function ajustarEspacoCinza() {
            let alturaTabela = $('#tabela tbody tr').length * 50; 
            let alturaCampos = 230; 
            let alturaFinal = alturaTabela + alturaCampos;
            $('#espaco-cinza').css('height', alturaFinal + 'px');
        }
    
        // executa ao adicionar uma nova linha 
        $('#adicionar').on('click', function() {
            ajustarEspacoCinza();
        });
    
        ajustarEspacoCinza();
    });
    
    function carregarTiposAcao() {
        return new Promise((resolve) => {
            $.get("/api/tipos-acao", function(tipos) {
                // Atualiza os selects
                const atualizaSelect = (seletor) => {
                    $(seletor).empty();

                    $(seletor).append('<option value="" disabled selected>Selecione o tipo de ação...</option>');

                    tipos.forEach(tipo => {
                        $(seletor).append($('<option>', {
                            value: tipo,
                            text: tipo
                        }));
                    });
                };

                atualizaSelect("#acao");
                atualizaSelect("#acaoEdit");
                resolve();
            });
        });
    }


        $("#adicionar").click(function() {
            let acao = $("#acao").val();
            let data_prevista = $("#data_prevista").val();
            let investimento = $("#investimento").val();
        
            // validação da data mínima
            let dataCadastro = new Date();
            let dataMinima = new Date(dataCadastro.setDate(dataCadastro.getDate() + 10)); 
        
            let dataPrevista = new Date(data_prevista); // aqui já deve ser a data
        
            if (dataPrevista < dataMinima) {
                alert("A data prevista deve ser pelo menos 10 dias após a data de cadastro.");
                return;
            }
        
            $.ajax({
                url: "/api/cadastrar",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    acao: acao,
                    data_prevista: data_prevista, // Envia a data corretamente
                    investimento: parseFloat(investimento) // Garantir que é numérico
                }),
                success: function(response) {
                    tabela.ajax.reload(null, false);
                },
                error: function(xhr) {
                    alert("Erro ao cadastrar: " + xhr.responseJSON.error);
                }
            });
        });

    $(document).on("click", ".excluir", function() {
        let id = $(this).data("id");
        $.ajax({
            url: `/api/excluir/${id}`,
            type: "DELETE",
            success: function() {
                tabela.ajax.reload(); 
            }
        });
    });
    

    $(document).on("click", ".editar", function() {
        let id = $(this).data("id");

        $.get(`/api/listar/${id}`, function(item) {
            // preenche os campos do modal com os dados atuais
            $("#acaoEdit").val(item.acao);
            $("#dataEdit").val(item.data_prevista);
            $("#investimentoEdit").val(item.investimento);

            $('#editarModal').modal('show');

            $("#salvarEdicao").click(function() {
                let acaoEdit = $("#acaoEdit").val();
                let dataEdit = $("#dataEdit").val();
                let investimentoEdit = $("#investimentoEdit").val();

                $.ajax({
                    url: `/api/editar/${id}`,
                    type: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify({ acao: acaoEdit, data_prevista: dataEdit, investimento: investimentoEdit }),
                    success: function() {
                        $('#editarModal').modal('hide');  
                        carregarDados();  
                        tabela.ajax.reload();
                    },
                    error: function(xhr, status, error) {
                        console.error("Erro ao editar:", error);
                    }
                });
            });
        });
    });

    init(); 

