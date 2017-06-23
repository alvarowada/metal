# Metal Slug
1. Diseño del juego

    1.1 Objetivo del juego: cómo se gana, cómo se pierde.
    
    Es un videojuego de tipo run and gun y shoot’em up cuyo objetivo es llegar al final del escenario matando al mayor número de enemigos utilizando armas que encontraremos por el escenario hasta llegar al jefe final, el cuál tendrá que ser derrotado para pasar de nivel o ganar la partida.
    El jugador dispondrá de una vida por nivel, la cuál se irá agotando cada vez que los enemigos le disparen. Cuando el jugador reciba daño 5 veces por parte de sus enemigos, éste morirá y el juego finalizará. Estas vidas se pueden recargar con Power Ups que encontrará el jugador a lo largo del nivel
    
    Controles
    se usa W A S D para moverser J para saltar K disparar y L lanzar bomba 
    
    
    2.2 Principales mecánicas.
    
- Escenario: El escenario en el que se deserrolla el juego es de tipo plataformas en el que el jugador podrá interactuar con él pudiendo saltar para alcanzar ciertos objetos, y avanzar venciendo los enemigos que aparezcan hasta llegar donde se encuentra el jefe final y derrotarlo.
    
- Acción: El personaje no tendrá barra de salud ya que morirá de un golpe, pero tendrá varias vidas para volverlo a intentar desde donde se quedó.

- Enemigos: El jugadore se encontrará a lo largo del nivel a diferentes enemigos con diferentes armas que tratarán de que nuestro personaje principal no llegue al final de la misión. Cada enemigo tendrá a su vez diferente vida y armas con munición de distinto tipo.

- Armas: A lo largo del juego se colocarán diferentes Power Ups en forma de armas. Éstas armas nos proporcionarán una mayor potencia de tiro al aunmentar el daño inflingido por las balas, lo que nos ayudará con los enemigos más fuertes.

- Vidas: El personaje dispondrá de unicamente 1 sola vida la cuál se agotará cuando reciba 5 impactos de bala por parte de sus enemigos. Ésta vida podrá ser aumentada con el uso de Power Ups que irá encontrando por el nivel.

- Putuación: El personaje conseguirá una serie de puntos por las acciones que realice en el juego, por matar enemigos, por conseguir power ups , por acuchillar enemigos, por matarles con bombas, etc...

2. Diseño de la implementación:
Arquitectura y Principales Componentes.

Se ha añadido una mascara de colisiones para poder elegir con que tipo de sprites quieres chocar.

Personajes:

- Walter: Es el personaje principal del videojuego. A parte del movimiento principal de saltar, agacharse y desplazarse, éste personaje es capaz de lanzar bombas, disparar numerosas armas y acuchillar a los enemigos. En su método fire comprueba si los enemigos están a una distancia <=50, si es así el personaje acuchilla al enemigo causándole 5 puntos de daño y si se encuentra a una distancia superior disparará con su arma causándole distinto daño dependiendo de la arma que tenga en ese momento. 
    
- Soldado Enemigo: Se ha implementado un componente que extiende de nuestro Enemy, el cuál comprueba cuándo nuestro personaje principal se encuentra a menos de 300 m para poder disparar.
    
- Enemigo Final: Existen dos tipos de enemigos finales. Para la mision 1 tenemos a un tanque el cuál lanza cohetes que te persiguen y por otro lado para la segunda misión se ha implementado un helicoptero el cuál sigue tu posicion y te dispara. Para el primer enemigo final se ha implementado un componente que extiende de nuestro Enemy, el cuál comienza a disparar cuando detecta a una distancia determinada a nuestro personaje. Dispara una rafaga de 4 misilies y vuelve a comprobar la posición del personaje principal para volver a disparar.
Para el segundo enemigo final se ha implementado un componente que extiende de nuestro Enemy, el cuál cada 0.5 segundo comprueba la posición de nuestro jugador y de desplaza para colocarse encima suyo y lanzar una ráfaga de 4 disparos.

Municion y Armas:

- Bombas: El personaje puede lanzar una serie de 10 bombas las cuáles pueden explotar por dos motivos, si botan ms de 2 veces o si impactan directamente con un enemigo. La explosión causará 5 puntos de daño a todo enemigo que se encuentre en un ratio de 150 y tras la cuál se obtendrá una puntuación adicional de 20 puntos.

- Pistola: Tanto el personaje principal, cuando no disponga de power ups y el enemigo, usarán la postola para causar 1 punto de daño al enemigo. Estas balas colisionarán sólo con el contrincante gracias a la matriz de colisiones que hemos implementado, es decir, los enemigos no se pueden matar entre ellos y nuestras balas no nos pueden hacer daño.

- Escopeta: Tras coger el Power Up "S" de la escopeta, nuestro personaje causará 5 de daño a todos los enemigos que estén a una distancia <15 y recibirá una puntuación de 20. La munición es limitada y cuando se gasta volverás a tener la pistola.

- Metralleta: Tras coger el Power Up "H" de la metralleta, nuestro personaje causará un daño doble con sus disparos. La munición es limitada y cuando se gasta volverás a tener la pistola.

- Cohetes: Éste tipo de munición será usado por el enemigo de la primera misión. Estos cohetes seguirán al personaje durante 4 segundos, tras los cuáles si no han colisionado con nuestro jugador, explotarán automáticamente.

- Cuchillo: Para el uso del cuchillo, nuestro jugador tiene que estar a una distancia <= 50, con lo que el método fire en vez de generar una bala, mata directamente al enemigo que tiene mas cerca incrementando su score en 40. 


Power Ups:

- H Power Up: Es un componente que extiende de Power Up y que cuando el personaje lo coge, adquiere una ventaja en forma de arma, una Metralleta, la cuál causa mayor daño y tiene una munición limitada.

- S Power Up: Es un componente que extiende de Power Up y que cuando el personaje lo coge, adquiere una ventaja en forma de arma, una Escopeta, la cuál causa un daño mayor, matando a los enemigos que están a una cierta distancia.

- V Power Up: Es un componente que extiende de Power Up y que cuando el personaje lo coge, adquiere una ventaja en forma de vida, la vida aunmenta 5 puntos.

- B Power Up: Es un componente que extiende de Power Up y que cuando el personaje lo coge, adquiere una ventaja en forma de munición de bombas, recarga en 10 las bombas que el personaje tiene.

3. Equipo de trabajo y reparto de tareas:

4. Fuentes y referencias:
Referencias a todos los assets no propios utilizados en la realización del juego.

Para la obtención de los sonidos y efectos del juego se ha utilizado un video de youtube el cuál luego se ha recortado para obtener los distintos clips de audio necesarios
    https://www.youtube.com/watch?v=VyoPINrHq20
    https://www.youtube.com/watch?v=ukPytvHxSWU
    https://www.youtube.com/watch?v=whu7Bcf2uvg
    https://www.youtube.com/watch?v=sadmk_yk_ck

Para el recorte de los audios se ha utilizado esta web que permite la edición de una pista de audio
    http://mp3cut.net/es/

Para consultar información sobre las mecanicas a implementar se han utilizado diferentes páginas webs                             http://www.html5quintus.com/guide/core.md#.WUzoGBPygnU
    http://blog.sklambert.com/html5-canvas-game-the-enemy-ships/
    http://donmik.com/como-hacer-un-juego-shootem-up-con-quintus-parte-3/
    http://gaia.fdi.ucm.es/files/people/pedro/slides/dvi/03quintus.html
    
Para la obtención de los sprites se ha utilizado la siguiente web 
    http://spritedatabase.net/file/3892
    https://opengameart.org/
    
Para la extracción de los sprites para las animaciones se ha usado la herramienta ShoeBox
    https://shoeboxapp.com/

Para la creación / edición de los mapas tmx de los niveles se ha usado la herramienta Tiled
    http://www.mapeditor.org/
