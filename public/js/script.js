document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener('click', function(e){

        e.preventDefault();

        const destino = document.querySelector(this.getAttribute('href'));

        if(destino){

            destino.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

});

const horarios = document.querySelectorAll(".horario");

const inputHorario = document.getElementById("horario");

horarios.forEach(botao => {

    botao.addEventListener("click", () => {

        horarios.forEach(h => {

            h.classList.remove("ativo");

        });

        botao.classList.add("ativo");

        inputHorario.value = botao.textContent;

    });

});