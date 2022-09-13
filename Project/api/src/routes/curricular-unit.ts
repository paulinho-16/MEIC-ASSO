import express from 'express'

import controller from '@/controller/curricular-unit.controller'

import constants from '@/config/constants'

const router = express.Router()

/**
 * @swagger
 * /curricular-unit/{id}:
 *   get:
 *     summary: Fetch all information about a given curricular unit, including its classes of students
 *     tags:
 *         - Curricular Unit
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: Curricular Unit ID
 *     responses:
 *       200:
 *         description: The information about the curricular unit
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 acronym:
 *                   type: string
 *                 name:
 *                   type: string
 *                 courses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       acronym:
 *                         type: string
 *                       year:
 *                          type: number
 *                       credits: 
 *                          type: number
 *                       number:
 *                          type: number
 *                 teachers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                 assessmentComponents:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       designation:
 *                         type: string
 *                       weight:
 *                         type: number
 *                 courseUnitsTimes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       designation:
 *                         type: string
 *                       hours:
 *                         type: number
 *                 language:
 *                   type: string
 *                 objectives:
 *                   type: string
 *                 program:
 *                   type: string
 *                 mandatoryLiterature:
 *                   type: string
 *                 teachingMethodsAndActivities:
 *                   type: string
 *                 evaluation:
 *                   type: string
 *                 outcomesAndCompetences:
 *                   type: string
 *                 workingMethod:
 *                   type: string
 *                 requirements:
 *                   type: string
 *                 complementaryBibliography:
 *                   type: string
 *                 examEligibility:
 *                   type: string
 *                 calculationFormula:
 *                   type: string
 *                 specialAssessment:
 *                   type: string
 *                 classificationImprovement:
 *                   type: string
 *                 classes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       students:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                             number:
 *                               type: string
 *                             email:
 *                               type: string
 *                             allocationDate:
 *                               type: string
 *                             enrolled:
 *                               type: boolean
 *               example:
 *                 code: M.EIC010
 *                 acronym: ASSO
 *                 name: Arquitetura de Sistemas de Software
 *                 courses:
 *                   - acronym: M.EIC
 *                     year: 1
 *                     credits: 6
 *                     hours: 162
 *                 teachers:
 *                   - name: Ademar Manuel Teixeira de Aguiar
 *                   - name: Filipe Alexandre Pais de Figueiredo Correia
 *                 assessmentComponents:
 *                   - designation: Participação presencial
 *                     weight: 10
 *                   - designation: Teste
 *                     weight: 30
 *                   - designation: Trabalho escrito
 *                     weight: 30
 *                   - designation: Trabalho laboratorial
 *                     weight: 30
 *                   - designation: 'Total: '
 *                     weight: 100
 *                 courseUnitsTimes:
 *                   - designation: Estudo autónomo
 *                     hours: 20
 *                   - designation: Frequência das aulas
 *                     hours: 42
 *                   - designation: Trabalho laboratorial
 *                     hours: 100
 *                   - designation: 'Total: '
 *                     hours: 162
 *                 language: Português - Suitable for English-speaking students
 *                 objectives: À medida que os sistemas de software aumentam de dimensão e de complexidade torna-se cada vez mais importante compreendê-los a níveis de abstracção mais elevados...
 *                 program: 'Introdução • Desenho de software: conceitos e princípios fundamentais • O que é arquitetura de software? • A importância da arquitetura de software • Design...
 *                 mandatoryLiterature: 'Erich Gamma... [et al.]; Design patterns . ISBN: 0-201-63361-2 Buschmann, F., Henney, K. & Schmidt, D.C.; Pattern-Oriented Software Architecture...
 *                 teachingMethodsAndActivities: As aulas serão utilizadas para a exposição formal dos principais tópicos da unidade curricular e para a apresentação final e discussão...
 *                 evaluation: Avaliação distribuída sem exame final
 *                 outcomesAndCompetences: 'No final da disciplina os alunos deverão ser capazes de: • Reconhecer os principais padrões de arquitetura existentes para sistemas de software...
 *                 workingMethod: Presencial
 *                 requirements: Os alunos devem ter conhecimentos e experiência anterior em desenvolvimento de software, programação orientada por objectos, e engenharia de software.
 *                 complementaryBibliography: 'Bass, Len; Software Architecture in Practice . ISBN: 0-201-19930-0'
 *                 examEligibility: Obtenção de pelo menos 50% da avaliação nas componentes teste, trabalho escrito e trabalho laboratorial .
 *                 calculationFormula: Nota final = (teste x 30%) + (projecto x 60%) + (desempenho individual x 10%).
 *                 specialAssessment: Idênticas às dos alunos ordinários.
 *                 classificationImprovement: A classificação final pode ser melhorada através de repetição do teste (em casos excepcionais devidamente justificados) e/ou evolução do projecto.
 *                 classes:
 *                   - name: 1MEIC01
 *                     students:
 *                       - name: Nome do aluno 1
 *                         number: '201800001'
 *                         email: up201800001@edu.fe.up.pt
 *                         allocationDate: 22-02-2022 18:40
 *                         enrolled: true
 *                       - name: Nome do aluno 2
 *                         number: '201800002'
 *                         email: up201800002@edu.fe.up.pt
 *                         allocationDate: 22-02-2022 18:40
 *                         enrolled: false
 *                       - name: Nome do aluno 3
 *                         number: '201800003'
 *                         email: up201800003@edu.fe.up.pt
 *                         allocationDate: 22-02-2022 18:70
 *                         enrolled: true
 *                   - name: 1MEIC02
 *                     students:
 *                       - name: Nome do aluno 4
 *                         number: '201800004'
 *                         email: up201800004@edu.fe.up.pt
 *                         allocationDate: 22-02-2022 18:40
 *                         enrolled: true
 *                       - name: Nome do aluno 5
 *                         number: '201800005'
 *                         email: up201800005@edu.fe.up.pt
 *                         allocationDate: 22-02-2022 18:40
 *                         enrolled: true
 *                       - name: Nome do aluno 6
 *                         number: '201800006'
 *                         email: up201800006@edu.fe.up.pt
 *                         allocationDate: 22-02-2022 18:57
 *                         enrolled: false
 *
 *       500:
 *         description: Unexpected error
*/
router.get('/:id', controller.getCurricularUnitInfo)


/**
 * @swagger
 * /curricular-unit/{id}/url:
 *   get:
 *     summary: Fetch URL necessary to retrieve curricular unit information
 *     tags:
 *         - Curricular Unit
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: Curricular Unit ID
 *     responses:
 *       200:
 *         description: The URL necessary to retrieve curricular unit information
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *             example:
 *               https://sigarra.up.pt/feup/pt/ucurr_geral.ficha_uc_view?pv_ocorrencia_id=486247
 *       500:
 *         description: Unexpected error
 */
router.route('/:id/url')
    .get(function (req, res) {
        res.status(200).send(`${constants.curricularUnitUrl}?pv_ocorrencia_id=${req.params.id}`);
    });

export default router
