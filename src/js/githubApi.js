const GITHUB_CONFIG = {
    owner: 'seu-usuario',
    repo: 'Eco-Mania',
    path: 'src/data/leaderboard.json',
    branch: 'main'
};

// Função para ler o leaderboard
async function getLeaderboard() {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        const content = JSON.parse(atob(data.content));
        return content;
    } catch (error) {
        console.error('Erro ao buscar leaderboard:', error);
        return [];
    }
}

// Função para atualizar o leaderboard (requer token de acesso)
async function updateLeaderboard(newData, token) {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}`;
    
    try {
        // Primeiro, buscar o SHA atual do arquivo
        const getResponse = await fetch(url);
        const fileData = await getResponse.json();
        
        // Atualizar o arquivo
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'Atualizar leaderboard',
                content: btoa(JSON.stringify(newData, null, 2)),
                sha: fileData.sha,
                branch: GITHUB_CONFIG.branch
            })
        });
        
        return await response.json();
    } catch (error) {
        console.error('Erro ao atualizar leaderboard:', error);
        throw error;
    }
}
