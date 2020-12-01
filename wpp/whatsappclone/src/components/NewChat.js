import React, { useState, useEffect } from 'react';//para criar novo chat de contato lado esquerdo topo... states e efect ativa hooks
import './NewChat.css';

import Api from '../Api';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';//icone voltar

export default ({user, chatlist, show, setShow}) => {/*show chatlist.. abrir e fechar o nova conversa usando transition no css */
    const [list, setList] = useState([]);//lista de contatos array

    useEffect(()=>{//usando effect.. ao iniciar tela..
        const getList = async () => {//função assincrona para ser executada..
          if(user !== null)// se tem algum usuario logado..
          {
            let results = await Api.getContactList(user.id);//pega a lista com firebase
            setList(results) //mostra resultados        
          }
        }
        getList();
      },[user]);

      const addNewChat = async (user2) => {//abrir chat no nova conversa.. recebendo segundo usuario firebase
        await Api.addNewChat(user, user2);//dois usuarios.. para iniciar conversa
    
        handleClose();//após criado fecha tela..
      }

    const handleClose = () => {/*cria o botão q da false e volta page principal app.js */
        setShow(false)
      }

    return (
        <div className="newChat"  style={{left: show ? 0: -415}}>{/**area geral movimenta esquerda fechar ou abrir */}
            <div className="newChat--head">{/*cabeçario.. */}
                <div onClick={handleClose} className="newChat--backbutton">{/*botão de voltar */}
                    <ArrowBackIcon style={{color: '#FFF'}}/>{/*iconde de seta voltar <- */}
                </div>
                <div className="newChat--headtitle">Nova Conversa</div>{/*conteudo texto */}
            </div>
            <div className="newChat--list">{/*lista dos contatos */}
              {list.map((item, key)=>(/*é um mapa simples de chave/valor. Qualquer valor (objeto e valores primitivos) */
                <div onClick={()=>addNewChat(item)} className="newChat--item" key={key}>{/*fazendo cada um dos contatos com foto e nome do cara gera click contatos */}
                    <img className="newChat--itemavatar"src={item.avatar} alt=""/>
                    <div className="newChat--itemname">{item.name}</div>
                    </div>
                ))}   
            </div> 
        </div>
    );
}