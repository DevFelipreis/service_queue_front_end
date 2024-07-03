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
                <form id="filaForm">
                    <label for="filter">Filtrar por:</label>
                    <select id="filter" name="filter">
                        <option value="name">Nome</option>
                        <option value="preferential===true">Preferencial</option>
                        <option value="open_service===false">Não Atendido</option>
                        <option value="open_service===true">Atendido</option>
                        <option value="">Todos</option>
                    </select>
                    <br><br>
                    <button type="submit">Buscar</button>
                </form>
            `;
            document.getElementById('filaForm').addEventListener('submit', async (event) => {
                event.preventDefault();
                const filter = document.getElementById('filter').value;

                try {
                    const response = await fetch(`http://localhost:3000/queue?filter=${encodeURIComponent(filter)}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    const result = await response.json();
                    content.innerHTML += `<p>Resultado: ${JSON.stringify(result)}</p>`;
                } catch (error) {
                    content.innerHTML += `<p>Erro: ${error.message}</p>`;
                }
            });
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
                const senha = document.getElementById('password').value;
                const guiche = document.getElementById('ticket_window').value;

                try {
                    const response = await fetch('http://localhost:3000/operator', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({ name, email, senha, guiche }),
                    });
                    const result = await response.json();
                    content.innerHTML += `<p>Operador criado: ${JSON.stringify(result)}</p>`;
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
                        body: JSON.stringify({ name, email, senhaAtual, senhaNova, guiche }),
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
                    <label for="currentPassword">Senha:</label>
                    <input type="password" id="currentPassword" name="currentPassword" required>
                    <br><br>
                    <button type="submit">Apagar</button>
                </form>
                <p>Tem certeza de que deseja apagar o perfil?</p>
                <button onclick="confirmDelete(true)">Sim</button>
                <button onclick="confirmDelete(false)">Não</button>
            `;
            document.getElementById('apagarPerfilForm').addEventListener('submit', async (event) => {
                event.preventDefault();
                const currentPassword = document.getElementById('currentPassword').value;

                try {
                    const response = await fetch('http://localhost:3000/operator', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({ currentPassword }),
                    });
                    const result = await response.json();
                    content.innerHTML += `<p>Perfil apagado: ${JSON.stringify(result)}</p>`;
                } catch (error) {
                    content.innerHTML += `<p>Erro: ${error.message}</p>`;
                }
            });
            break;
        default:
            break;
    }
}
