import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import RelatorioOsService from "../../services/RelatorioOsService";

import style from '../../styles/FiltroRelatorioStyle.module.scss';
import GlobalStyle from '../../styles/GlobalStyle.module.scss'

function FiltroRelatorio() {
    const navigate = useNavigate();
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [searchNumeroOs, setSearchNumeroOs] = useState("");
    const [relatorios, setRelatorios] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const tableRef = React.useRef<HTMLTableElement>(null);

    const handleFiltrar = async () => {
        setLoading(true);
        try {
            const data = await RelatorioOsService.listarRelatorios();
            setRelatorios(data);
            if (data.length === 0) {
                toast.info("Nenhum relatório encontrado", { theme: "dark" });
            } else {
                toast.success(`${data.length} relatório(s) encontrado(s)`, { theme: "dark" });
            }
        } catch (error: any) {
            toast.error(error.message || "Erro ao carregar relatório", { theme: "dark" });
        } finally {
            setLoading(false);
        }
    };

    // Filter relatorios by search term
    const filteredRelatorios = relatorios.filter(r =>
        searchNumeroOs === "" || r.numeroOs?.toString().includes(searchNumeroOs)
    );

    const handleExportarCSV = () => {
        if (filteredRelatorios.length === 0) {
            toast.error("Nenhum dado para exportar", { theme: "dark" });
            return;
        }

        const csv = [
            ["Número OS", "Descrição", "Técnico ID", "Data Início", "Data Fim", "Data Criação"],
            ...filteredRelatorios.map(r => [
                r.numeroOs,
                r.descricao,
                r.tecnicoId || 'N/A',
                r.dataInicio ? new Date(r.dataInicio).toLocaleDateString() : 'N/A',
                r.dataFim ? new Date(r.dataFim).toLocaleDateString() : 'N/A',
                r.dataCriacao ? new Date(r.dataCriacao).toLocaleDateString() : 'N/A'
            ])
        ].map(row => row.join(",")).join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `relatorio_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handleExportarPDF = async () => {
        if (filteredRelatorios.length === 0) {
            toast.error("Nenhum dado para exportar", { theme: "dark" });
            return;
        }

        try {
            // Dynamically import jsPDF
            const jsPDFModule = await import('jspdf');
            const jsPDF = jsPDFModule.default;

            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4',
            });

            // Add title
            pdf.setFontSize(16);
            pdf.text('Relatório de Ordens de Serviço', 15, 15);
            pdf.setFontSize(10);
            pdf.text(`Período: ${new Date(dataInicio).toLocaleDateString()} a ${new Date(dataFim).toLocaleDateString()}`, 15, 25);
            pdf.text(`Data de Geração: ${new Date().toLocaleDateString()}`, 15, 32);

            // Table configuration
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 10;
            const tableStartY = 40;
            const colWidths = [20, 50, 25, 30, 30, 30];
            const headers = ['Número OS', 'Descrição', 'Técnico ID', 'Data Início', 'Data Fim', 'Data Criação'];
            
            let currentY = tableStartY;
            const rowHeight = 7;
            const headerHeight = 8;

            // Draw header
            pdf.setFillColor(33, 150, 243);
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(9);
            pdf.setFont(undefined, 'bold');
            
            let currentX = margin;
            headers.forEach((header, index) => {
                pdf.rect(currentX, currentY, colWidths[index], headerHeight, 'F');
                pdf.text(header, currentX + 2, currentY + 5);
                currentX += colWidths[index];
            });

            currentY += headerHeight;

            // Draw rows
            pdf.setTextColor(0, 0, 0);
            pdf.setFont(undefined, 'normal');
            pdf.setFontSize(8);

            filteredRelatorios.forEach((relatorio, rowIndex) => {
                // Check if we need a new page
                if (currentY + rowHeight > pageHeight - margin) {
                    pdf.addPage();
                    currentY = margin;
                    
                    // Redraw header on new page
                    pdf.setFillColor(33, 150, 243);
                    pdf.setTextColor(255, 255, 255);
                    pdf.setFont(undefined, 'bold');
                    pdf.setFontSize(9);
                    
                    currentX = margin;
                    headers.forEach((header, index) => {
                        pdf.rect(currentX, currentY, colWidths[index], headerHeight, 'F');
                        pdf.text(header, currentX + 2, currentY + 5);
                        currentX += colWidths[index];
                    });
                    
                    currentY += headerHeight;
                    pdf.setTextColor(0, 0, 0);
                    pdf.setFont(undefined, 'normal');
                    pdf.setFontSize(8);
                }

                // Alternate row colors
                if (rowIndex % 2 === 0) {
                    pdf.setFillColor(240, 240, 240);
                    currentX = margin;
                    colWidths.forEach(width => {
                        pdf.rect(currentX, currentY, width, rowHeight, 'F');
                        currentX += width;
                    });
                }

                // Draw row data
                const rowData = [
                    relatorio.numeroOs?.toString() || '',
                    relatorio.descricao || '',
                    relatorio.tecnicoId?.toString() || 'N/A',
                    relatorio.dataInicio ? new Date(relatorio.dataInicio).toLocaleDateString() : 'N/A',
                    relatorio.dataFim ? new Date(relatorio.dataFim).toLocaleDateString() : 'N/A',
                    relatorio.dataCriacao ? new Date(relatorio.dataCriacao).toLocaleDateString() : 'N/A'
                ];

                currentX = margin;
                rowData.forEach((data, index) => {
                    pdf.text(data, currentX + 2, currentY + 5);
                    currentX += colWidths[index];
                });

                currentY += rowHeight;
            });

            pdf.save(`relatorio_${new Date().toISOString().split('T')[0]}.pdf`);
            toast.success("PDF exportado com sucesso!", { theme: "dark" });
        } catch (error: any) {
            console.error("Erro ao exportar PDF:", error);
            toast.error("Erro ao exportar PDF. Certifique-se de que jsPDF está instalado.", { theme: "dark" });
        }
    };

    const handleExportarRelatorioIndividual = async (relatorio: any) => {
        try {
            const jsPDFModule = await import('jspdf');
            const jsPDF = jsPDFModule.default;

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            pdf.setFontSize(16);
            pdf.text(`Relatório da OS #${relatorio.numeroOs}`, 15, 15);
            pdf.setFontSize(10);
            pdf.text(`Data de Geração: ${new Date().toLocaleDateString()}`, 15, 25);

            let currentY = 35;
            const lineHeight = 7;
            const labelWidth = 50;
            const pageHeight = pdf.internal.pageSize.getHeight();

            pdf.setFontSize(10);
            pdf.setFont(undefined, 'bold');
            
            const details = [
                { label: 'Número OS:', value: relatorio.numeroOs?.toString() || '' },
                { label: 'Descrição:', value: relatorio.descricao || '' },
                { label: 'Técnico:', value: relatorio.nomeTecnico || 'Não atribuído' },
                { label: 'Setor:', value: relatorio.nomeSetor || 'Não informado' },
                { label: 'Data de Início:', value: relatorio.dataInicio ? new Date(relatorio.dataInicio).toLocaleDateString() : 'N/A' },
                { label: 'Data de Fim:', value: relatorio.dataFim ? new Date(relatorio.dataFim).toLocaleDateString() : 'N/A' },
                { label: 'Data de Criação:', value: relatorio.dataCriacao ? new Date(relatorio.dataCriacao).toLocaleDateString() : 'N/A' },
            ];

            details.forEach(detail => {
                if (currentY > pageHeight - 20) {
                    pdf.addPage();
                    currentY = 15;
                }
                
                pdf.setFont(undefined, 'bold');
                pdf.text(detail.label, 15, currentY);
                pdf.setFont(undefined, 'normal');
                
                const maxWidth = 130;
                const splitText = pdf.splitTextToSize(detail.value, maxWidth);
                pdf.text(splitText, 15 + labelWidth, currentY);
                
                currentY += lineHeight * splitText.length + 2;
            });

            pdf.save(`Relatorio_OS_${relatorio.numeroOs}_${new Date().toISOString().split('T')[0]}.pdf`);
            toast.success("Relatório exportado com sucesso!", { theme: "dark" });
        } catch (error: any) {
            console.error("Erro ao exportar relatório:", error);
            toast.error("Erro ao exportar relatório", { theme: "dark" });
        }
    };

    return (
        <div className={GlobalStyle.PageContainer}>
            <ToastContainer/>
            <div className={GlobalStyle.Logo}/>
            <div className={style.ContainerPrincipal}>
                <div className={style.Title}>
                    <h2>Relatório de Ordens de Serviço</h2>
                </div>

                <div className={style.FiltroContainer}>
                    <div className={style.InputGroup}>
                        <label className={style.InputLabel}>Data Início</label>
                        <input 
                            className={style.InputField}
                            type="date"
                            value={dataInicio}
                            onChange={(e) => setDataInicio(e.target.value)}
                        />
                    </div>

                    <div className={style.InputGroup}>
                        <label className={style.InputLabel}>Data Fim</label>
                        <input 
                            className={style.InputField}
                            type="date"
                            value={dataFim}
                            onChange={(e) => setDataFim(e.target.value)}
                        />
                    </div>

                    <button 
                        className={style.FiltrarButton}
                        onClick={handleFiltrar}
                        disabled={loading}
                    >
                        {loading ? "Carregando..." : "Filtrar"}
                    </button>
                </div>

                {relatorios.length > 0 && (
                    <div className={style.SearchContainer}>
                        <input 
                            className={style.SearchInput}
                            type="text"
                            placeholder="Pesquisar por número da OS"
                            value={searchNumeroOs}
                            onChange={(e) => setSearchNumeroOs(e.target.value)}
                        />
                    </div>
                )}

                {relatorios.length > 0 && (
                    <div className={style.RelatorioContainer}>
                        <table className={style.RelatorioTable} ref={tableRef}>
                            <thead>
                                <tr>
                                    <th>Número OS</th>
                                    <th>Descrição</th>
                                    <th>Data Criação</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRelatorios.map((relatorio, index) => (
                                    <tr key={index}>
                                        <td>{relatorio.numeroOs}</td>
                                        <td>{relatorio.descricao}</td>
                                        <td>{relatorio.dataCriacao ? new Date(relatorio.dataCriacao).toLocaleDateString() : 'N/A'}</td>
                                        <td>
                                            <button 
                                                className={style.ExportarButton}
                                                onClick={() => handleExportarRelatorioIndividual(relatorio)}
                                                style={{ padding: '6px 12px', fontSize: '12px' }}
                                            >
                                                Exportar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className={style.ContainerButtons}>
                            <button className={style.ExportarButton} onClick={handleExportarCSV}>
                                Exportar CSV
                            </button>
                            <button className={style.ExportarButton} onClick={handleExportarPDF}>
                                Exportar PDF
                            </button>
                        </div>
                    </div>
                )}

                <div className={style.ContainerButtons}>
                    <button className={style.BackButton} onClick={() => navigate("/home")}>
                        Voltar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FiltroRelatorio
