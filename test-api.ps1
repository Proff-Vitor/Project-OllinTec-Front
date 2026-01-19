# Script de Teste da API - OllinTec

$API_URL = "https://project-ollintec-back.onrender.com/api"

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║         Teste de Conectividade da API - OllinTec              ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

# Teste 1: Verificar conectividade com a API
Write-Host "🔍 Teste 1: Verificando conectividade com a API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$API_URL/login" -Method Options -ErrorAction Stop
    Write-Host "✅ API está acessível" -ForegroundColor Green
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao conectar com a API" -ForegroundColor Red
    Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Teste 2: Testar login com credenciais inválidas
Write-Host "🔍 Teste 2: Testando login com credenciais inválidas..." -ForegroundColor Yellow
try {
    $loginData = @{
        email = "teste@teste.com"
        senha = "senha123"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$API_URL/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $loginData `
        -ErrorAction Stop

    Write-Host "✅ Requisição enviada com sucesso" -ForegroundColor Green
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Resposta esperada (credenciais inválidas)" -ForegroundColor Yellow
    Write-Host "   Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
}

Write-Host ""

# Teste 3: Verificar endpoints de Ordens de Serviço
Write-Host "🔍 Teste 3: Verificando endpoint de Ordens de Serviço..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$API_URL/ordem-servico" `
        -Method Get `
        -ErrorAction Stop

    Write-Host "✅ Endpoint de OS está acessível" -ForegroundColor Green
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Green
    
    $data = $response.Content | ConvertFrom-Json
    Write-Host "   Total de OS: $($data.Count)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Erro ao acessar endpoint de OS" -ForegroundColor Yellow
    Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""

# Teste 4: Verificar endpoints de Usuários
Write-Host "🔍 Teste 4: Verificando endpoint de Usuários..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$API_URL/usuario" `
        -Method Get `
        -ErrorAction Stop

    Write-Host "✅ Endpoint de Usuários está acessível" -ForegroundColor Green
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Erro ao acessar endpoint de Usuários" -ForegroundColor Yellow
    Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""

# Teste 5: Verificar endpoints de Setores
Write-Host "🔍 Teste 5: Verificando endpoint de Setores..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$API_URL/setor" `
        -Method Get `
        -ErrorAction Stop

    Write-Host "✅ Endpoint de Setores está acessível" -ForegroundColor Green
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Green
    
    $data = $response.Content | ConvertFrom-Json
    Write-Host "   Total de Setores: $($data.Count)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Erro ao acessar endpoint de Setores" -ForegroundColor Yellow
    Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""

# Teste 6: Verificar endpoints de Equipamentos
Write-Host "🔍 Teste 6: Verificando endpoint de Equipamentos..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$API_URL/tipo-equipamento" `
        -Method Get `
        -ErrorAction Stop

    Write-Host "✅ Endpoint de Equipamentos está acessível" -ForegroundColor Green
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Erro ao acessar endpoint de Equipamentos" -ForegroundColor Yellow
    Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""

# Resumo
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                    Testes Concluídos                          ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Próximos Passos:" -ForegroundColor Cyan
Write-Host "   1. Abra http://localhost:3000 no navegador" -ForegroundColor Cyan
Write-Host "   2. Faça login com suas credenciais" -ForegroundColor Cyan
Write-Host "   3. Teste as funcionalidades" -ForegroundColor Cyan
Write-Host ""
