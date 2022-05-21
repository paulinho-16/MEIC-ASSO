import express from 'express'

import controller from '@/controller/curricular-unit.controller'

const router = express.Router()

/**
 * @swagger
 * /curricular-unit/{id}:
 * get:
 *   summary: Fetch all information about a given curricular unit, including its classes of students
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       description: Curricular Unit ID
 *   responses:
 *     '200':
 *       description: The information about the curricular unit
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code: string
 *               acronym: string
 *               name: string
 *               courses:
 *               	 type: array
 * 								 items:
 * 								   type: object
 *  								 properties:
 *                     acronym: string
 * 										 year: number
 * 										 credits: number
 * 										 hours: number
 *							 teachers:
 * 							   type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name: string
 *							 assessmentComponents:
 * 							   type: array
 * 								 items:
 *                   type: object
 *                   properties:
 * 									   designation: string
 * 										 weight: number
 *							 courseUnitsTimes:
 * 							   type: array
 * 								 items:
 *                   type: object
 *                   properties:
 * 									   designation: string
 * 										 hours: number
 *							 language: string
 * 							 objectives: string
 * 							 program: string
 *               mandatoryLiterature: string
 * 							 teachingMethodsAndActivities: string
 * 							 evaluation: string
 * 							 outcomesAndCompetences: string
 * 							 workingMethod: string
 *               requirements: string
 *               complementaryBibliography: string
 *               examEligibility: string
 *               calculationFormula: string
 *               specialAssessment: string
 *               classificationImprovement: string
 *               classes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name: string
 *                     students:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name: string
 *                           number: string
 *                           email: string
 *                           allocationDate: string
 *                           enrolled: boolean
 *           examples:
 *             Curricular Unit:
 *               code: M.EIC010
 * 							 acronym: ASSO
 *               name: Arquitetura de Sistemas de Software
 * 							 courses:
 *                 - acronym: M.EIC
 *                   year: 1
 *                   credits: 6
 *                   hours: 162
 * 							 teachers:
 *                 - name: Ademar Manuel Teixeira de Aguiar
 *                 - name: Filipe Alexandre Pais de Figueiredo Correia
 * 							 assessmentComponents:
 *                 - designation: Participação presencial
 *                   weight: 10
 *                 - designation: Teste
 *                   weight: 30
 *                 - designation: Trabalho escrito
 *                   weight: 30
 *                 - designation: Trabalho laboratorial
 *                   weight: 30
 *                 - designation: Total: 
 *                   weight: 100
 * 							 courseUnitsTimes:
 *                 - designation: Estudo autónomo
 *                   hours: 20
 *                 - designation: Frequência das aulas
 *                   hours: 42
 *                 - designation: Trabalho laboratorial
 *                   hours: 100
 *                 - designation: Total: 
 *                   hours: 162
 * 							 language: Português - Suitable for English-speaking students
 *               objectives: À medida que os sistemas de software aumentam de dimensão e de complexidade torna-se cada vez mais importante compreendê-los a níveis de abstracção mais elevados. A arquitectura de um sistema de software descreve a sua estrutura global em termos dos seus componentes, das propriedades externas desses componentes e das suas interrelações. Para sistemas de média e grande dimensão a escolha adequada da arquitectura assume uma importância crucial para o sucesso do seu desenvolvimento. A disciplina de Arquitecturas de Sistemas de Software tem como objectivo principal introduzir os conceitos de arquitecturas de software, padrões de desenho e tópicos directamente relacionados, tais como o de componentes de software. Pretende ensinar a desenhar, compreender e avaliar arquitecturas de sistemas de software, tanto ao nível de abstracção de macro-arquitectura como de micro-arquitectura e assim familiarizar os alunos com os conceitos fundamentais de arquitectura de software, as propriedades e aplicabilidade dos diferentes estilos de arquitectura existentes, os padrões de desenho mais populares, componentes de software, arquitecturas reutilizáveis e as relações destes conceitos todos com a reutilização de software.
 *               program: Introdução • Desenho de software: conceitos e princípios fundamentais \n• O que é arquitetura de software? \n• A importância da arquitetura de software \n• Design a múltiplos níveis, do macro ao micro: estilos arquiteturais e padrões de arquitetura, padrões de desenho e idiomas \nPadrões de Software • As origens dos padrões de software \n• Exemplos de padrões de desenho (GoF) \n• Exemplos de padrões de arquitetura (POSA) \n• Refatoração para padrões \nArquiteturas de Software • Atributos de qualidade \n• Avaliando arquiteturas: funções objetivo \n• Desenhando para atributos de qualidade: táticas \n• Representação e Documentação de arquiteturas de software \n• Reutilização de arquiteturas de software: linhas de produção, frameworks, componentes de software \nArquiteturas de Software Evolucionárias • Lei de Conway \n• Mudança incremental \n• Acoplamento arquitetural \n• Evolução de dados \n• Construção de arquiteturas evoluíveis \n• Refatoração arquitetural \n• Microserviços, exemplo de uma arquitetura desenhada para a evolução
 *               mandatoryLiterature: Erich Gamma... [et al.]; Design patterns . ISBN: 0-201-63361-2 \nBuschmann, F., Henney, K. & Schmidt, D.C.; Pattern-Oriented Software Architecture Volume 4: A Pattern Language for Distributed Computing , Wiley, 2007. ISBN: 0470059028 \nFord, N., Parsons, R. & Kua, P.; Building evolutionary architectures: Support constant change, O'Reilly Media, 2017. ISBN: 1491986360
 *               teachingMethodsAndActivities: As aulas serão utilizadas para a exposição formal dos principais tópicos da unidade curricular e para a apresentação final e discussão dos projetos desenvolvidos pelos estudantes ao longo do semestre. Para focar a atenção dos estudantes, nos tópicos principais serão propostas pequenas questões de resposta facultativa e livre sobre os tópicos em estudo para desenvolvimento fora de aulas. Ao longo do semestre os estudantes  terão oportunidade de colocar em prática os conhecimentos transmitidos através de pequenos exercícios e desenvolvimento incremental de um projeto de média dimensão. As questões, os exercícios e o projeto conjuntamente incentivarão os estudantes  a complementar os conhecimentos transmitidos com conhecimentos resultantes de pesquisas individuais efetuadas sobre os conteúdos da unidade curricular.
 *               evaluation: Avaliação distribuída sem exame final
 *               outcomesAndCompetences: No final da disciplina os alunos deverão ser capazes de: • Reconhecer os principais padrões de arquitetura existentes para sistemas de software. \n• Descrever uma arquitetura de forma precisa. \n• Idealizar diferentes arquiteturas alternativas para resolver um mesmo problema e avaliar de forma justificada qual é a melhor em função dos atributos de qualidade que suporta. \n• Reconhecer e compreender diversos padrões de desenho. \n• Conhecer e aplicar diversos métodos e técnicas de reutilização de software. \n• Identificar os fatores chave no desenho de arquiteturas de software evoluíveis. \n• Desenhar um plano de migração entre diferentes tipos de arquitetura. \n• Construir um sistema de software de média dimensão de acordo com uma especificação de requisitos, selecionando e aplicando padrões de desenho e de arquitetura, usando um método de desenvolvimento baseado em componentes e tecnologias recentes. \n• Utilizar ferramentas que tornem mais expedita a realização das tarefas de desenvolvimento.
 *               workingMethod: Presencial
 *               requirements: Os alunos devem ter conhecimentos e experiência anterior em desenvolvimento de software, programação orientada por objectos, e engenharia de software.
 *               complementaryBibliography: Bass, Len; Software Architecture in Practice . ISBN: 0-201-19930-0
 *               examEligibility: Obtenção de pelo menos 50% da avaliação nas componentes teste , trabalho escrito e trabalho laboratorial.
 *               calculationFormula: Nota final = (teste x 30%) + (projecto x 60%) + (desempenho individual x 10%).
 *               specialAssessment: Idênticas às dos alunos ordinários.
 *               classificationImprovement: A classificação final pode ser melhorada através de repetição do teste (em casos excepcionais devidamente justificados) e/ou evolução do projecto.
 *               classes:
 *                 - name: 1MEIC01
 *                   students:
 *                     - name: Nome do aluno 1
 * 										   number: 201800001
 *                       email: 201800001@edu.fe.up.pt
 *                       allocationDate: 22-02-2022 18:40
 *                       enrolled: true
 *                     - name: Nome do aluno 2
 * 										   number: 201800002
 *                       email: 201800002@edu.fe.up.pt
 *                       allocationDate: 22-02-2022 18:40
 *                       enrolled: false
 *                     - name: Nome do aluno 3
 * 										   number: 201800003
 *                       email: 201800003@edu.fe.up.pt
 *                       allocationDate: 22-02-2022 18:57
 *                       enrolled: true
 *                 - name: 1MEIC02
 *                   students:
 *                     - name: Nome do aluno 4
 * 										   number: 201800004
 *                       email: 201800004@edu.fe.up.pt
 *                       allocationDate: 22-02-2022 18:40
 *                       enrolled: true
 *                     - name: Nome do aluno 5
 * 										   number: 201800005
 *                       email: 201800005@edu.fe.up.pt
 *                       allocationDate: 22-02-2022 18:57
 *                       enrolled: false
 *                     - name: Nome do aluno 6
 * 										   number: 201800006
 *                       email: 201800006@edu.fe.up.pt
 *                       allocationDate: 22-02-2022 18:40
 *                       enrolled: true
 *
 *     '500':
 *       description: Unexpected error
 */
router.get('/:id', controller.getCurricularUnitInfo)

export default router