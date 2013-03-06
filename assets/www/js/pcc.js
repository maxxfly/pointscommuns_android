var url_commentaire = "http://www.pointscommuns.com/inc/web_services/phonegap_commentaires.php";
var url_agenda = "http://www.pointscommuns.com/inc/web_services/phonegap_agenda.php";

var delay_update = 1000 * 60 * 30 // 30 minute

$(document).ready(function()
  {
    
  }
);


function go_menu()
{
  window.location = 'index.html';
}

function load_best_comment()
{
  best_unixdate = window.localStorage.getItem('best_unixdate');

   if((!best_unixdate || best_unixdate < new Date().getTime() - delay_update ) && (!navigator.network || navigator.network.connection.type != "NONE"))
   {
     window.localStorage.setItem('best_unixdate', new Date().getTime());
     
     display_waiting('Récuperation des commentaires');
     $.ajax({ url: url_commentaire +"?callback=save_comments&best=1",
               jsonp: true,
               dataType: "jsonp"
              });
   }
   else
   {
      if(!window.localStorage.getItem("json_best_comment"))
      {
        window.alert('Vous etes pas connecté a internet');
      }
      else
      {
        display_comments( JSON.parse(window.localStorage.getItem("json_best_comment")) );
      }
   }
}

function load_last_comment()
{
  last_unixdate = window.localStorage.getItem('last_unixdate');
  
  if((!last_unixdate || last_unixdate < new Date().getTime() - delay_update ) && (!navigator.network || navigator.network.connection.type != "NONE"))
  {
    //console.log('AJAX');
    window.localStorage.setItem('last_unixdate', new Date().getTime());
    display_waiting('Récuperation des commentaires');
    $.ajax({ url: url_commentaire +"?callback=save_comments",
               jsonp: true,
               dataType: "jsonp"
              });
  }
  else
  {
    //console.log('CACHE');
    
    if(!window.localStorage.getItem("json_last_comment"))
    {
      window.alert('Vous etes pas connecté a internet');
    }
    else
    {
      display_comments( JSON.parse(window.localStorage.getItem("json_last_comment")) );
    }
  }
}

function save_comments(d)
{
  hide_waiting();
  for(i=0; i < d.length; i++)
  {
    window.localStorage.setItem('article_'+ d[i].idCommentaire, JSON.stringify(d[i]));
    
    // on allege avant le localstorage
    delete d[i].Contenu;
  }
  
  if($("#new_tab.selected").length > 0)
  {
    window.localStorage.setItem("json_last_comment", JSON.stringify(d));
  }
  else
  {
    window.localStorage.setItem("json_best_comment", JSON.stringify(d));
  }
  
  display_comments(d);
}

function display_comments(d)
{
  $('#commentaires ARTICLE').remove();
  
  for(i=0; i < d.length; i++)
  {
    $('#commentaires').append('<article id="'+ (($("#new_tab.selected").length > 0) ? "l" : "b")   + d[i].idCommentaire +'"><h2>'+ d[i].Titre  +'</h2>' 
        +'par <span class="pseudo_'+ d[i].idsexe +'">'+ d[i].Pseudo +'</span><br/>sur <span class="objet_'+ d[i].Flag +'">'+ d[i].Infos_objet['Titre_json']  +'</span>'
        +'</article>');
  }

  $('#commentaires ARTICLE').bind('click touch', function(e) { 
        e.stopPropagation();
        window.localStorage.setItem("param_commentaire", e.currentTarget.id);
        window.location = "commentaire.html";
    });
}


function display_commentaire(i)
{
 c = JSON.parse(window.localStorage.getItem("article_"+ i));

 $('H1:first').html(c.Titre);
 $('H2:first SPAN').html(c.Infos_objet['Titre_json']); 
 $('H3:first SPAN').html(c.Pseudo);
 $('#commentaire').html(c.Contenu.replace(/\n/g, '<br/>'));
 
 $('H3:first SPAN').addClass('pseudo_'+ c.idsexe );
 $('H2:first SPAN').addClass('objet_'+ c.Flag ); 
 
}

function change_tab(i)
{
  $('.onglets > .selected').removeClass('selected');
  $('#'+ i).addClass('selected');
  
  window.localStorage.setItem("tab_comment", i);
  
  if(i == "new_tab") { load_last_comment(); }
  else  { load_best_comment(); }  
}

function display_waiting(msg)
{
  $('#waiting P').html(msg);
  $('#waiting').addClass('display');
}

function hide_waiting()
{
  $('#waiting').removeClass('display');
}
