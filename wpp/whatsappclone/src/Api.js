import firebase from 'firebase/app';//importando api´s do firebase q serão utilizadas
import 'firebase/firebase-auth';
import 'firebase/firebase-firestore';//firestone é novo real time database do firebase

import firebaseConfig from './firebaseConfig';

const firebaseApp = firebase.initializeApp(firebaseConfig);//processo de conexão com firebase com wpp
const db = firebase.firestore();//db: banco de dados com firebase

export default {
    fbPopup:async () => {//função assincrona faz login com facebook
        const provider = new firebase.auth.FacebookAuthProvider();//nova classe
        let result = await firebaseApp.auth().signInWithPopup(provider);//abrir login com facebook 
        return result;
      },
      addUser:async (u) => {//criando usuario apos ter criado uma colection users no firebase
        await db.collection('users').doc(u.id).set({//espera pelo banco de dados users criado firebase firestone id face
          name: u.name,
          avatar: u.avatar
        },{merge:true});//se achar dados merge true altera as informaçoes
      },//dados da pessoa acima..

      getContactList:async (userId) => {//lista de contatos para firebase, id para ter lista de contatos menos o proprio usuario
        let list = [];// lista contatos inicia vazio
        
        let results = await db.collection('users').get();//pega todos os registros da colection do firebase
        results.forEach(result => {//pega item a item..
          let data = result.data()//pega dados do usuario..
    
          if (result.id !== userId) {//se id meu for diferente do usuario aleatorio..
            list.push({//adiciona na lista.
              id: result.id,
              name: data.name,
              avatar: data.avatar
            });//pegando firebase todos usuarios menos a si proprio
          }
        });
    
        return list;
      },

  addNewChat:async (user, user2) => {//recebendo 2 usuarios aqui..
    
    // Cria chat
    let newChat = await db.collection('chats').add({//inicia novo chat..
      messages:[],//mensagem inicia vazio
      users:[user.id, user2.id]//usuarios participando
    });//seta informaçoes..

    // Ref. para usuario 1
    db.collection('users').doc(user.id).update({//update usuario 1 dados..
      chats: firebase.firestore.FieldValue.arrayUnion({//add items array q ja possui firebase
        chatId: newChat.id,
        title: user2.name,//usuario 2 no usuario 1..
        image: user2.avatar,
        with: user2.id
      })
    });

    // Ref. para usuario 2
    db.collection('users').doc(user2.id).update({
      chats: firebase.firestore.FieldValue.arrayUnion({
        chatId: newChat.id,
        title: user.name,
        image: user.avatar,
        with: user.id
      })
    });

  },

  onChatList:(userId, setChatList) => {//aparecer o chat mesmo.. setChatlist add array chatlist
    return db.collection('users').doc(userId).onSnapshot((doc)=>{//onSnapshot tira foto manda doc
      if(doc.exists){//se existe doc
        let data = doc.data();               

        if(data.chats) {
          let chats = [...data.chats];           
          
          chats.sort((a,b)=>{//organizar quem mandou mensagem para quem
            if(a.lastMessageDate === undefined) {  //se for indefinido          
              return -1;//vai para começo
            }
            if(b.lastMessageDate === undefined) {            
              return -1;
            }            
            if(a.lastMessageDate.seconds < b.lastMessageDate.seconds){              
              return 1;
            }else{            
              return -1;
            }          
          });          
          
          setChatList(chats);//exibe chat
        }
      }
    });
  },

  onChatContent:(chatId, setList, setUsers) => {//chat sera monitorado, lista
    return db.collection('chats').doc(chatId).onSnapshot((doc)=>{//retorna banco dados chats o id print doc
      if (doc.exists){
        let data = doc.data();
        setList(data.messages);//seta as mensagem dentro da lista
        setUsers(data.users);//lista dos usuarios envolvidos
      }
    });
  },

  sendMessage:async (chatData, userId, type, body, users)=>{//envio da mensagem o que é preciso
    let now = new Date();//data atual no zap de cada mensagem
    db.collection('chats').doc(chatData.chatId).update({
      messages: firebase.firestore.FieldValue.arrayUnion({//dados serão adicionados
        type,
        author: userId,
        body,
        date: now
      })
    });

    for(let i in users) {//usuarios
      let u = await db.collection('users').doc(users[i]).get();//
      let uData = u.data();
      if(uData.chats) {
        let chats = [...uData.chats];

        for(let e in chats){
          if(chats[e].chatId === chatData.chatId) {//achando id chat usuario
            chats[e].lastMessage = body;
            chats[e].lastMessageDate = now;//troca para agora
          }
        }

        await db.collection('users').doc(users[i]).update({//update usuarios no chats
          chats
        });
      }
    }

  }
}