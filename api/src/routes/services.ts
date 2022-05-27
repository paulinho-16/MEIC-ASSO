import express from 'express'

import controller from '../controller/services.controller'

const router = express.Router()

/**
 * @swagger
 * /services/{serviceNumber}:
 *   get:
 *     summary: Fetch service's information for service with serviceNumber
 *     parameters:
 *       - in: path
 *         name: serviceNumber
 *         required: true
 *         description: Service ID
 *     responses:
 *       200:
 *         description: The informations about the service
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   title: 
 *                       type: string
 *                   url: 
 *                       type: string
 *                   acronym: 
 *                       type: string
 *                   mission: 
 *                       type: string
 *                   description: 
 *                       type: string
 *                   schedule: 
 *                       type: string
 *                   head: 
 *                       type: string
 *                   contact: 
 *                       type: string
 *                   address: 
 *                       type: string
 *                   postalCode: 
 *                       type: string
 *                   locality: 
 *                       type: string
 *             example:
 *               title: "Serviços de Documentação e Informação"
 *               url: "https://sigarra.up.pt/feup/pt/uni_geral.unidade_view?pv_unidade=84"
 *               acronym: "SDInf"
 *               mission: "Disponibilizar a informação de suporte às atividades pedagógicas, de investigação e inovação da FEUP, a par da salvaguarda e difusão do seu património cultural e científico."
 *               description: "Aos Serviços de Documentação e Informação compete gerir os recursos de informação cientifico-técnica e de cariz pedagógico, a documentação administrativa e os recursos patrimoniais de componente cultural, científica ou tecnológica, numa abordagem teórica e funcional que integram a Biblioteconomia, Arquivologia e Museologia, dando centralidade ao documento, à informação e ao seu uso e gestão em contexto organizacional. Os SDI integram as unidades de Arquivo, Biblioteca, Museu e Serviços Eletrónicos, com missões, recursos e pessoal específicos mas numa prática integradora onde as novas tecnologias de criação, armazenamento, difusão e comunicação da informação ganham um papel relevante."
 *               schedule: "08h30-19h30 (segunda-feira a sexta-feira): acesso restrito à comunidade FEUP"
 *               head: "Luís Miguel Costa"
 *               contact: "351 225081442"
 *               address: "SDI Arquivo : Biblioteca : Museu Rua Dr. Roberto Frias"
 *               postalCode: "4200-465"
 *               locality: "Porto"
 *       500:
 *         description: Unexpected error
 */
router.get('/:id', controller.getServices)

export default router