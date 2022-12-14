const OpenAuction = artifacts.require("OpenAuction");

module.exports = function (deployer, network, accounts) {
  // deployment steps
  // deployer.deploy(
  //   OpenAuction,
  //   3600,
  //   accounts[3],
  //   "Giga Watt",
  //   "The Washington state-based Giga Watt mining facility is among the largest in North America.  This super mine exerts a ridicules 30 MW hashrate and incorporates just over 1,700 GPUs.",
  //   "https://coincentral.com/wp-content/uploads/2018/05/16388051_204990046641128_6870174302440485694_n.jpeg"
  // );

  deployer.deploy(
    OpenAuction,
    60,
    accounts[4],
    "Gedimino pilis",
    "Vilniaus aukštutinė pilis - gotikinė pilis Vilniuje, kurios liekanos stūkso Gedimino kalno aikštelėje. Papėdėje buvo LDK kunigaikščio Vytauto Didžiojo rezidencija, dabar - atstatyti Valdovų rūmai. Iš pagarbos Vilniaus įkūrėjui LDK kunigaikščiui Gediminui pilis pavadinta jo vardu. Pilis priklauso Vilniaus pilių rezervatui. Gedimino pilies bokštas - labiausiai turistų lankoma Vilniaus vieta. Skaičiuojama, kad per vienerius metus Gedimino pilyje apsilanko daugiau kaip 150 tūkst. žmonių. Lietuvos valstybės šimtmečio proga buvo pristatyta Aukštutinės pilies atkūrimo vizualizacija.",
    "https://upload.wikimedia.org/wikipedia/commons/9/9d/Gedimino_pilis_by_Augustas_Didzgalvis.jpg"
  );
};
