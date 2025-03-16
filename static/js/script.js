$(document).ready(function() {
    let tabela = $("#tabela").DataTable({ //  textos do datatable em pt/br
        "language": {
            "sProcessing":     "Processando...",
            "sLengthMenu":     "Exibir _MENU_ registros",
            "sZeroRecords":    "Nenhum registro encontrado",
            "sInfo":           "Mostrando de _START_ até _END_ de _TOTAL_ registros",
            "sInfoEmpty":      "Mostrando 0 até 0 de 0 registros",
            "sInfoFiltered":   "(filtrado de _MAX_ registros totais)",
            "sSearch":         "Pesquisar:",
            "oPaginate": {
                "sFirst":    "Primeiro",
                "sPrevious": "Anterior",
                "sNext":     "Próximo",
                "sLast":     "Último"
            }
        }
    });




     // limpar os valores dos campos de entrada
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

    // ajusta a altura do espaço cinza conforme os campos são preenchidos ou a tabela cresce
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
    

    function carregarDados() {
        $.get("/api/listar", function(data) {
            tabela.clear();
            data.forEach(item => {
                let dataFormatada = formatarData(item.data_prevista);
                
                tabela.row.add([
                    item.acao,
                    dataFormatada,
                    "R$ " + Number(item.investimento).toLocaleString('pt-BR', { minimumFractionDigits: 2 }), 
                    `<button class="btn btn-primary btn-sm editar" data-id="${item.id}"><span class="glyphicon glyphicon-pencil"></span></button>`,
                    `<button class="btn btn-danger btn-sm excluir" data-id="${item.id}"><span class="glyphicon glyphicon-remove"></span></button>`
                ]).draw();
            });
        });
    }

    $("#adicionar").click(function() {
        let acao = $("#acao").val();
        let data = $("#data_prevista").val();
        let investimento = $("#investimento").val();

         // validação da data mínima
         let dataCadastro = new Date();
         let dataMinima = new Date(dataCadastro.setDate(dataCadastro.getDate() + 10)); 

         let dataPrevista = new Date(data);

         if (dataPrevista < dataMinima) {
            alert("A data prevista deve ser pelo menos 10 dias após a data de cadastro.");
            return;
        }


        $.ajax({
            url: "/api/cadastrar",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ acao, data_prevista: data, investimento }),
            success: function() {
                carregarDados();
            },
            error: function(xhr, status, error) {
                console.error("Erro ao cadastrar:", error);
            }
        });
    });

    $(document).on("click", ".excluir", function() {
        let id = $(this).data("id");
        $.ajax({
            url: `/api/excluir/${id}`,
            type: "DELETE",
            success: carregarDados
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
                        carregarDados();  // atualiza a tabela
                    },
                    error: function(xhr, status, error) {
                        console.error("Erro ao editar:", error);
                    }
                });
            });
        });
    });

    carregarDados();
});
