function clic(animation) {
    animation.fonction(animation)
    animation.compteur += 1
}

function afficherLegende(animation, texte) {
    animation.legende.textContent = texte
}

function dessinerTableIP(animation, x1, y1, nombreLignes, textes, xS, yS) {
    const x2 = x1 + 160
    const y2 = y1 + 30*(nombreLignes+1)
    var txt = `<polygon points="${x1},${y1} ${x1},${y2} ${x2},${y2} ${x2},${y1}" stroke="black" fill="white"/>`
    animation.svg.innerHTML = `<line x1="${xS}" y1="${yS}" x2="${xS}" y2="${y1}" stroke="black" stroke-dasharray="3 2"/>` + animation.svg.innerHTML
    for (let i=1; i<=nombreLignes; i++) {
        txt += `<line x1="${x1}" y1="${y1 + 30*i}" x2="${x2}" y2="${y1 + 30*i}" stroke="black"/>`
    }
    textes.forEach((s, i) => {
        txt += `<text x="${x1+40}" y="${y1+45+i*30}">${s}</text>`
        txt += `<text x="${x1+100}" y="${y1+45+i*30}">${s}</text>`
        txt += `<text x="${x1+140}" y="${y1+45+i*30}">1</text>`
    })
    txt += `<text x="${x1+40}" y="${y1+15}" font-weight="bold">joindre</text>`
    txt += `<line x1="${x1+80}" y1="${y1}" x2="${x1+80}" y2="${y2}" stroke="black"/>`
    txt += `<text x="${x1+100}" y="${y1+15}" font-weight="bold">via</text>`
    txt += `<line x1="${x1+120}" y1="${y1}" x2="${x1+120}" y2="${y2}" stroke="black"/>`
    txt += `<text x="${x1+140}" y="${y1+15}" font-weight="bold">coût</text>`
    animation.svg.innerHTML += txt
}

function completerTableIP(animation, x1, y1, ligne, textes) {
    var txt = ''
    const dx = [40, 100, 140]
    textes.forEach((lbl, i) => {
        txt += lbl?`<text x="${x1+dx[i]}" y="${y1+15+ligne*30}" fill="red">${lbl}</text>`:''
    })
    animation.svg.innerHTML += txt
}

function miseEnPlace(animation) {
        var txt = '<svg xml:lang="fr" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 15 500 600">'
        const sommets = [{nom:'A', x:20, y:260}, {nom:'B', x:140, y:320}, {nom:'C', x:140, y:200}, {nom:'D', x:260, y:260}, {nom:'E', x:350, y:320}, {nom:'F', x:380, y:200}, {nom:'G', x:500, y:260}]
        const aretes = [[0, 1], [0, 2], [1, 2], [1, 4], [2, 3], [3, 4], [3, 5], [4, 6], [5, 6]]
        aretes.forEach(A => {
            const d = sommets[A[0]]
            const a = sommets[A[1]] 
            txt += '<line x1="'+d.x+'" y1="'+d.y+'" x2="'+a.x+'" y2="'+a.y+'" stroke="black"/>'
        })
        sommets.forEach(s => {
            txt += '<circle cx="'+s.x+'" cy="'+s.y+'" r="16"/>'
            txt += '<text x="'+s.x+'" y="'+s.y+'">'+s.nom+'</text>'
        })
        txt += '</svg><p class="centrer">A souhaite envoyer un paquet à G.</p>'
        animation.div.innerHTML = txt
        animation.svg = animation.div.firstChild
        animation.legende = animation.div.lastChild
}

function fonctionAnimation(animation) {
    const frames = [() => miseEnPlace(animation),
                    () => {afficherLegende(animation, "Mise en place des tables de routage."),
                           dessinerTableIP(animation, -48, 310, 3, ["B", "C"], 20, 260),
                           dessinerTableIP(animation, 80, 440, 4, ["A", "C", "E"], 140, 320),
                           dessinerTableIP(animation, 250, 440, 3, ["B", "D", "G"], 350, 320),
                           dessinerTableIP(animation, 388, 310, 2, ["E", "F"], 500, 260),
                           dessinerTableIP(animation, 10, 20, 4, ["A", "B", "D"], 140, 200),
                           dessinerTableIP(animation, 180, 20, 4, ["C", "E", "F"], 260, 260),
                           dessinerTableIP(animation, 350, 50, 2, ["D", "G"], 380, 200)},
                    () => {afficherLegende(animation, "G n'est pas présent dans la table de routage."),
                           completerTableIP(animation, -48, 310, 3, ["G", "", ""])},
                    () => afficherLegende(animation, "A demande à ses voisins s'ils peuvent communiquer avec G."),
                    () => {afficherLegende(animation, "G n'est pas présent dans les tables de B et C."),
                           completerTableIP(animation, 80, 440, 4, ["G", "", ""]),
                           completerTableIP(animation, 10, 20, 4, ["G", "", ""])},
                    () => afficherLegende(animation, "B et C demandent à leurs voisins s'ils peuvent communiquer avec G."),
                    () => {afficherLegende(animation, "G est présent dans la table de E mais pas dans celle de D."),
                           completerTableIP(animation, 180, 20, 4, ["G", "", ""])},
                    () => {afficherLegende(animation, "E indique à B qu'il sait communiquer avec G. Pendant ce temps, D demande à ses voisins."),
                           completerTableIP(animation, 80, 440, 4, ["", "E", "2"])},
                    () => {afficherLegende(animation, "L'information se propage à A, C et D."),
                           completerTableIP(animation, -48, 310, 3, ["", "B", "3"]),
                           completerTableIP(animation, 10, 20, 4, ["", "B", "3"]),
                           completerTableIP(animation, 180, 20, 4, ["", "E", "2"])},
                    () => afficherLegende(animation, "A peut maintenant envoyer son paquet à G.")]
    if (animation.compteur < frames.length) {frames[animation.compteur]()}
}

const animation = {div:document.getElementById("animationIP"), compteur:0, fonction:fonctionAnimation}
animation.div.addEventListener("click", event => clic(animation))
