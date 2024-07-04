function loadContent(page) {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Necessário realizar o login para entrar no sistema.');
        window.location.href = './index.html';
        return;
    }

    const content = document.getElementById('content');
    switch (page) {
        case 'fila':
            content.innerHTML = `
            <h2>Fila de Atendimento</h2>
            <h2>Filtrar por:</h2>
            <form id="filtrarNome">
                <label for="name">Nome:</label>
                <input type="text" id="name" name="name" required>
                <br><br>                    
                <button type="submit">Buscar</button>
            </form>
            <form id="filaForm">
                <label for="filter">Filtrar por:</label>
                <select id="filter" name="filter">
                    <option value=""></option>
                    <option value="preferential===true">Preferencial</option>
                    <option value="preferential===false">Não Preferencial</option>
                    <option value="open_service===false">Não Atendido</option>
                    <option value="open_service===true">Atendido</option>
                    <option value="">Todos</option>
                </select>
                <br><br>
                <button type="submit">Buscar</button>
            </form>
        `;

            const filtrarNomeForm = document.getElementById('filtrarNome');
            filtrarNomeForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                const name = document.getElementById('name').value.trim();

                if (name === '') {
                    content.innerHTML += '<p>Por favor, insira um nome para buscar.</p>';
                    return;
                }

                try {
                    const response = await fetch(`http://localhost:3000/queue-name?name=${name}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    const result = await response.json();
                    renderQueue(result.queue);
                } catch (error) {
                    content.innerHTML += `<p>Erro: ${error.message}</p>`;
                }
            });

            const filaForm = document.getElementById('filaForm');
            filaForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                const filter = document.getElementById('filter').value;

                try {
                    let endpoint = '';
                    switch (filter) {
                        case 'preferential===true':
                            endpoint = 'queue-preferential-true';
                            break;
                        case 'preferential===false':
                            endpoint = 'queue-preferential-false';
                            break;
                        case 'open_service===false':
                            endpoint = 'queue-open-service-false';
                            break;
                        case 'open_service===true':
                            endpoint = 'queue-open-service-true';
                            break;
                        case '':
                            endpoint = 'queue-all';
                            break;
                        default:
                            content.innerHTML += `<p>Opção de filtro inválida.</p>`;
                            return;
                    }

                    const response = await fetch(`http://localhost:3000/${endpoint}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    const result = await response.json();
                    if (!result.queue) {
                        content.innerHTML += '<p>Nenhum resultado encontrado.</p>';
                        return;
                    }
                    renderQueue(result.queue);
                } catch (error) {
                    content.innerHTML += `<p>Erro: ${error.message}</p>`;
                }
            });

            function renderQueue(queue) {
                let html = '<h3>Resultados:</h3>';
                html += '<ul>';
                queue.forEach(item => {
                    const status = item.open_service ? 'Aberto' : 'Fechado';
                    html += `
                    <li><strong>Nome:</strong> ${item.name}<br></li>
                    <li><strong>Preferencial:</strong> ${item.preferential ? 'Sim' : 'Não'}<br></li>
                    <li><strong>Status de Atendimento:</strong> ${status}<br></li>
                    <li><strong>Início da Fila:</strong> ${new Date(item.queue_started).toLocaleString()}<br></li>
                    <li><strong>Início do Atendimento:</strong> ${item.service_started ? new Date(item.service_started).toLocaleString() : 'Não iniciado'}<br></li>
                    <li><strong>Término do Atendimento:</strong> ${item.service_finished ? new Date(item.service_finished).toLocaleString() : 'Não concluído'}</li>
                                    `;
                });
                html += '</ul>';
                content.innerHTML += html;
            }
            break;

        case 'criarOperador':
            content.innerHTML = `
                    <h2>Criar Operador</h2>
                    <form id="criarOperadorForm">
                        <label for="name">Nome:</label>
                        <input type="text" id="name" name="name" required>
                        <br><br>
                        <label for="email">Email:</label>
                        <input type="email" id="email" name="email" required>
                        <br><br>
                        <label for="password">Senha:</label>
                        <input type="password" id="password" name="password" required>
                        <br><br>
                        <label for="ticket_window">Guichê:</label>
                        <input type="number" id="ticket_window" name="ticket_window" required>
                        <br><br>
                        <button type="submit">Criar</button>
                    </form>
                `;
            document.getElementById('criarOperadorForm').addEventListener('submit', async (event) => {
                event.preventDefault();
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const ticketWindow = parseInt(document.getElementById('ticket_window').value, 10);

                // Validate the ticket window input
                if (isNaN(ticketWindow)) {
                    content.innerHTML += `<p>Erro: Guichê deve ser um número válido</p>`;
                    return;
                }

                try {
                    const response = await fetch('http://localhost:3000/operator', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({ name, email, password, ticket_window: ticketWindow }),
                    });

                    if (!response.ok) {
                        throw new Error(`Erro: ${response.statusText}`);
                    }

                    const result = await response.json();
                    content.innerHTML += `
                            <p>Operador criado com sucesso:</p>
                            <ul>
                                <li><strong>ID:</strong> ${result.usuario.id}</li>
                                <li><strong>Nome:</strong> ${result.usuario.name}</li>
                                <li><strong>Email:</strong> ${result.usuario.email}</li>
                                <li><strong>Guichê:</strong> ${result.usuario.ticket_window}</li>
                                <li><strong>Fila aberta:</strong> ${result.usuario.open_queue ? 'Sim' : 'Não'}</li>
                                <li><strong>Início do serviço:</strong> ${new Date(result.usuario.service_started).toLocaleString()}</li>
                            </ul>
                        `;
                } catch (error) {
                    content.innerHTML += `<p>Erro: ${error.message}</p>`;
                }
            });
            break;


        case 'atualizarPerfil':
            content.innerHTML = `
                <h2>Atualizar Perfil</h2>
                <form id="atualizarPerfilForm">
                    <label for="name">Nome:</label>
                    <input type="text" id="name" name="name">
                    <br><br>
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email">
                    <br><br>
                    <label for="senhaAtual">Senha Atual:</label>
                    <input type="password" id="senhaAtual" name="senhaAtual" required>
                    <br><br>
                    <label for="senhaNova">Senha Nova:</label>
                    <input type="password" id="senhaNova" name="senhaNova">
                    <br><br>
                    <label for="guiche">Guichê:</label>
                    <input type="number" id="guiche" name="guiche">
                    <br><br>
                    <button type="submit">Atualizar</button>
                </form>
            `;
            document.getElementById('atualizarPerfilForm').addEventListener('submit', async (event) => {
                event.preventDefault();
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const senhaAtual = document.getElementById('senhaAtual').value;
                const senhaNova = document.getElementById('senhaNova').value;
                const guiche = document.getElementById('guiche').value;

                try {
                    const response = await fetch('http://localhost:3000/operator', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({ name, email, password, ticket_window: ticketWindow }),
                    });
                    const result = await response.json();
                    content.innerHTML += `<p>Perfil atualizado: ${JSON.stringify(result)}</p>`;
                } catch (error) {
                    content.innerHTML += `<p>Erro: ${error.message}</p>`;
                }
            });
            break;

        case 'apagarPerfil':
            content.innerHTML = `
                    <h2>Apagar Perfil</h2>
                    <form id="apagarPerfilForm">
                        <label for="password">Senha:</label>
                        <input type="password" id="password" name="password" required>
                        <br><br>
                        <p>Tem certeza de que deseja apagar o perfil?</p>
                        <p>Uma vez que o perfil for excluído, todos os seus dados serão excluídos.</p>
                        <button type="submit">Apagar</button>
                    </form>
                `;
            document.getElementById('apagarPerfilForm').addEventListener('submit', async (event) => {
                event.preventDefault();
                const currentPassword = document.getElementById('password').value;

                try {
                    const response = await fetch('http://localhost:3000/operator', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({ password: currentPassword }),
                    });
                    const result = await response.json();

                    if (!response.ok) {
                        return content.innerHTML += `<p>Mensagem: ${JSON.stringify(result)}</p>`;
                    }
                    content.innerHTML += `<p>Mensagem: ${JSON.stringify(result)}</p>`;
                    alert('Perfil apagado com sucesso!');
                    window.location.href = '../src/index.html';
                } catch (error) {
                    content.innerHTML += `<p>Erro: ${error.message}</p>`;
                }
            });
            break;
        default:
            break;
    }

}
