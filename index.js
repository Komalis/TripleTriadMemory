 function Carte(nom, img)
 {
     this.nom = nom;
     this.img = img;
     this.context = null;
     this.back = true;
 }

 Carte.prototype.flip = function(sound)
 {
     this.context[0].firstChild.setAttribute("src", this.img);
     this.context.flip(this.back);
     if (sound)
     {
         var audio = new Audio('sound/sound-card.wav');
         audio.play();
     }
     if (this.back)
     {
         this.back = false;
     }
     else
     {
         this.back = true;
     }

 }

 function Terrain()
 {
     this.cartes = [];
     this.error = false;
     this.started = false;
     this.couple = 8;
     this.generation();
     this.appendHTML();
     $(".card").flip(
     {
         trigger: "manual"
     });
     this.launch();
     this.carte_un = null;
     this.carte_deux = null;
 }

 Terrain.prototype.generation = function()
 {
     var noms = ['Shiva', 'Bahamut', 'Ifrit', 'Golgotha', 'Tauros', 'Taurux', 'Orbital', 'Helltrain'];
     for (var i = 0; i < 8; i++)
     {
         var newCarte = new Carte(noms[i], "img/" + noms[i] + ".bleue.jpg");
         var newCarte2 = new Carte(noms[i], "img/" + noms[i] + ".rouge.jpg");
         this.cartes.push(newCarte);
         this.cartes.push(newCarte2);
     }
 }

 Terrain.prototype.launch = function()
 {
     $(".card").each(function(index)
     {
         var carte = this.cartes[index];
         /* window.setTimeout(function()
          {
          }, i);
          i += 200;*/

         carte.flip(false);

         carte.context.animate(
         {
             left: 500 + -68 * (index % 4),
             top: Math.floor(index / 4) * -68
         }, 0);

     }.bind(this));
 }

 Terrain.prototype.start = function()
 {
     this.shuffle();
     this.error = false;
     this.couple = 8;
     this.started = true;
     var k = 200;
     $(".card").each(function(index)
     {
         var carte = this.cartes[index];
         /* window.setTimeout(function()
          {
          }, i);
          i += 200;*/

         window.setTimeout(function()
         {
             carte.context.animate(
             {
                 left: 0,
                 top: 0
             });
             var audio = new Audio('sound/sound-card.wav');
             audio.play();
         }, k);
         k += 200;

     }.bind(this));
 }

 Terrain.prototype.finish = function()
 {
     this.started = false;
     var i = 200;
     $(".card").each(function(index)
     {
         var carte = this.cartes[index];
         window.setTimeout(function()
         {
             carte.flip(true);
         }, i);
         i += 200;

         window.setTimeout(function()
         {
             carte.context.animate(
             {
                 left: 500 + -68 * (index % 4),
                 top: Math.floor(index / 4) * -68
             });
         }, i);
         i += 200;

     }.bind(this));
 }

 Terrain.prototype.shuffle = function()
 {
     var array = this.cartes;
     var m = array.length,
         t, i;

     // While there remain elements to shuffle…
     while (m)
     {

         // Pick a remaining element…
         i = Math.floor(Math.random() * m--);

         // And swap it with the current element.
         nom = array[m].nom;
         img = array[m].img;
         array[m].nom = array[i].nom;
         array[m].img = array[i].img;
         array[i].nom = nom;
         array[i].img = img;
     }

     return array;
 }

 Terrain.prototype.flip = function(card)
 {
     if (!this.started)
     {
         this.start();
     }
     else
     {
         if (!this.error)
         {
             if (this.carte_un == null)
             {
                 this.carte_un = card;
                 this.carte_un.flip(true);
             }
             else
             {
                 if (this.carte_un != card)
                 {
                     this.carte_deux = card;
                     this.carte_deux.flip(true);
                     this.check();
                 }
             }
         }
     }
 }

 Terrain.prototype.flipBack = function(card)
 {

     if (!this.error)
     {
         if (this.carte_un == card)
         {
             this.carte_un = null;
             card.flip(true);
         }
         else if (this.carte_deux == card)
         {
             this.carte_deux = null;
             card.flip(true);
         }
     }
 }

 Terrain.prototype.check = function()
 {
     if (this.carte_un.nom == this.carte_deux.nom)
     {
         var audio = new Audio('sound/sound-special.wav');
         this.couple--;
         audio.play();
         this.carte_un = null;
         this.carte_deux = null;
     }
     else
     {
         this.error = true;
         var audio = new Audio('sound/sound-invalid.wav');
         audio.play();
         window.setTimeout(function()
         {
             this.carte_un.flip(true);
             this.carte_un = null;
             this.carte_deux.flip(true);
             this.carte_deux = null;
             this.error = false;
         }.bind(this), 1000);
     }
     if (this.couple == 0)
     {
         var audio = new Audio('sound/win.wav');
         audio.play();
         window.setTimeout(function()
         {
             this.finish();
         }.bind(this), 2000);
     }
 }

 Terrain.prototype.appendHTML = function()
 {
     var tempothis = this;
     for (var i = 0; i < this.cartes.length; i++)
     {
         if (i % 4 == 0 && i != 0)
         {
             document.body.appendChild(document.createElement("br"));
         }
         var div = document.createElement("div");
         div.setAttribute("id", i);
         div.setAttribute("class", "card");

         var front = document.createElement("img");
         front.setAttribute("class", "front");
         front.setAttribute("src", this.cartes[i].img);
         front.setAttribute("alt", this.cartes[i].nom);

         var back = document.createElement("img");
         back.setAttribute("class", "back");
         back.setAttribute("src", "img/dos.png");
         back.setAttribute("alt", "dos");

         div.appendChild(front);
         div.appendChild(back);

         document.body.appendChild(div);

         this.cartes[i].context = $("#" + i);

         front.addEventListener("click", function(event)
         {
             //this.flipBack(this.cartes[event.srcElement.parentElement.getAttribute("id")]);
             //this.flip(this.cartes[event.srcElement.parentElement.getAttribute("id")]);
         }.bind(this));

         back.addEventListener("click", function(event)
         {
             //this.flipBack(this.cartes[event.srcElement.parentElement.getAttribute("id")]);
             this.flip(this.cartes[event.srcElement.parentElement.getAttribute("id")]);
         }.bind(this));
     }
 }

 var terrain = new Terrain();

 /* $(".card").flip();
  var i = 0;
  var j = 200;
  var k = ($(".card").size() / 2) * 900;
  $(".card").each(function()
  {
      var card = $(this);
      var cardContext = this;
      window.setTimeout(function()
      {
          card.flip(true);
          var audio = new Audio('sound/sound-card.wav');
          audio.play();
      }, j);
      j += 200;

      window.setTimeout(function()
      {
          card.animate(
          {
              left: 500 + -68 * (i % 4),
              top: Math.floor(i / 4) * -68
          });
          i++;
      }, j);
      j += 200;

      window.setTimeout(function()
      {
          card.animate(
          {
              left: 0,
              top: 0
          });
          var audio = new Audio('sound/sound-card.wav');
          audio.play();
      }, k);
      k += 200;

  });
 */
