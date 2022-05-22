import express from 'express'

import controller from '../controller/services.controller'

const router = express.Router()

/**
 * @swagger
 * /services/{serviceNumber}:
 * get:
 *   summary: Fetch service's information for service with serviceNumber
 *   parameters:
 *     - in: path
 *       name: serviceNumber
 *       required: true
 *       description: Service ID
 *   responses:
 *     '200':
 *       description: The informations about the service
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serviceInformation:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title: string
 *                     url: string
 *                     acronym: string
 *                     mission: string
 *                     description: string
 *                     schedule: string
 *                     head: string
 *                     contact: string
 *                     address: string
 *                     postalCode: string
 *                     locality: string
 *           examples:
 *            - title: "Serviços de Documentação e Informação",
 *              url: "https://sigarra.up.pt/feup/pt/uni_geral.unidade_view?pv_unidade=84",
 *              acronym: "SDInf",
 *              mission: "Disponibilizar a informação de suporte às atividades pedagógicas, de investigação e inovação da FEUP, a par da salvaguarda e difusão do seu património cultural e científico.",
 *              description: "Aos Serviços de Documentação e Informação compete gerir os recursos de informação cientifico-técnica e de cariz pedagógico, a documentação administrativa e os recursos patrimoniais de componente cultural, científica ou tecnológica, numa abordagem teórica e funcional que integram a Biblioteconomia, Arquivologia e Museologia, dando centralidade ao documento, à informação e ao seu uso e gestão em contexto organizacional. Os SDI integram as unidades de Arquivo, Biblioteca, Museu e Serviços Eletrónicos, com missões, recursos e pessoal específicos mas numa prática integradora onde as novas tecnologias de criação, armazenamento, difusão e comunicação da informação ganham um papel relevante.",
 *              schedule: "08h30-19h30 (segunda-feira a sexta-feira): acesso restrito à comunidade FEUP",
 *              head: "Luís Miguel Costa",
 *              contact: "351 225081442",
 *              address: "SDI Arquivo : Biblioteca : Museu Rua Dr. Roberto Frias",
 *              postalCode: "4200-465",
 *              locality: "Porto"
 *            - title: "Serviços Académicos",
 *              url: "https://sigarra.up.pt/feup/pt/uni_geral.unidade_view?pv_unidade=73",
 *              acronym: "SERAC",
 *              mission: "Garantir as atividades no âmbito da administração, gestão e apoio na área de gestão de curso; a área do acesso, ingresso e certificação; a área de gestão de estudante, de acordo com as instruções tutelares e as diretivas dos Órgãos de Gestão, constituindo a relação com o estudante o vetor essencial da sua atuação.",
 *              description: "Os Serviços Académicos exercem a sua atividade no âmbito da administração, da gestão e do apoio às formações pré e pós-graduada e à educação contínua.Os Serviços Académicos estão organizados nas seguintes áreas: Gestão de CursoEmail: suporte.cursos@fe.up.pt Gestão Acesso, Ingresso e CertificaçãoEmail: acesso.ingresso@fe.up.pt certificacao@fe.up.pt Gestão do EstudanteEmail: percurso.academico@fe.up.pt Em resultado da pandemia do COVID-19, é dada preferência ao atendimento por correio eletrónico ou telefone, assim como ao envio e receção de documentos por via eletrónica. Notas:- A FEUP disponibiliza uma solução web dispensadora de senhas para os atendimentos presenciais nos Serviços Académicos. A aplicação pode ser acedida a partir do endereço http://feup.qmagine.com/.Os utilizadores que pretendam utilizar esta aplicação devem efetuar um registo. Esse registo pode ser feito através da conta pessoal do Facebook ou podem criar um registo manual. Por motivos de segurança informática recomendamos que utilizem credenciais diferentes das credenciais normalmente utilizadas no SIGARRA.- Pode consultar informação sobre passe sub23 em: Declaração passe sub23- Caso tenha alguma certidão para levantamento e pretenda que a mesma lhe seja enviada pelo correio, deverá remeter e-mail para certificacao@fe.up.pt, através do email que consta na sua página pessoal de estudante.",
 *              schedule: "Atendimento dos Serviços Académicos: Presencial: 11:00-16:00 Telefónico: 9:30-12:00 e das 14:00-16:00 Os Serviços Académicos estarão encerrados no período de 24 a 31 de dezembro. Entre 3 e 8 de janeiro encontra-se encerrado o atendimento presencial, mantendo-se o atendimento telefónico.",
 *              head: "Matilde Fernanda Moreira",
 *              contact: "22 508 1977 / 1405",
 *              address: "Rua Dr. Roberto Frias, s/n 4200-465 Porto"
 *     '500':
 *       description: Unexpected error
 */
router.get('/:id', controller.getServices)

export default router