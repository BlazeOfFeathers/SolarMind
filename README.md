# ☀️ SolarMind

**Slimme sturing van je zonne-overschot in Home Assistant.** SolarMind volgt je zonnepanelen en je energiemeter en stuurt het overschot naar je verbruikers (boilers, laadpaal, ...) in de volgorde die jij kiest. Alles stel je in via een eigen paneel in Home Assistant, zonder YAML. De opzet is geïnspireerd op [RoomMind](https://github.com/snazzybean/roommind).

## Wat het doet

- **Verbruikers dynamisch toevoegen** in het paneel: aan/uit-verbruikers (boiler op een slimme stekker) en regelbare verbruikers (EV, laadstroom in ampère).
- **Prioriteit met drag & drop.** De bovenste verbruiker krijgt het overschot eerst.
- **Modus per verbruiker**
  - *Enkel zon*: draait alleen op overschot.
  - *Zon + nacht*: draait op zon en vult 's nachts aan van het net als er overdag te weinig zon was (drempel in kWh, temperatuur of batterij-%, eventueel overgeslagen als de voorspelling voor morgen goed is).
  - *Altijd aan* of *Uit*.
- **Hysterese**: start- en stopvertraging, minimale aan- en uit-tijd en een kleine toegelaten afname, zodat een wolk niet alles aan/uit laat klikken.
- **Detectie van een volle boiler**: als de stekker aan staat maar de boiler niets meer trekt (thermostaat), gaat het vrijgekomen overschot naar de volgende verbruiker.
- **Capaciteitstarief (piekbewaking)**: SolarMind houdt het kwartiergemiddelde van je afname bij en schakelt verbruikers af, of verlaagt de laadstroom, voordat je maandpiek stijgt.
- **Legionellacyclus** voor boilers met een temperatuursensor.
- **EV**: laadstroom volgt het overschot (1 of 3 fasen), minimum-%, in de modus Zon een minimaal laadvermogen dat je op het kaartje instelt (bij weinig zon aangevuld van het net), nachtladen tot een doel-%, en de resterende laadtijd tot 100% en tot de laadlimiet van de auto (batterijcapaciteit wordt geleerd uit je laadsessies). Je kan de Tesla rechtstreeks via de [Tesla BLE HTTP proxy](https://github.com/wimaha/TeslaBleHttpProxy) aansturen, of via bestaande HA-entities (laadschakelaar + laadstroom).
- **Thuisbatterij** als verbruiker die ook kan leveren (zie hieronder).
- **Analytics** per verbruiker en voor het hele huis: tijdlijn met zon/net-verdeling en waarom iets aan of uit ging, samenvatting (kWh, aandeel zon, looptijd, starts, besparing), per dag, dagritme, laadsessies en kwartierpieken.
- **Entities** per verbruiker (modus-select, vermogen, energie vandaag, aandeel zon, status, actief) en voor het huis (overschot, kwartiergemiddelde, maandpiek, ...), voor je dashboards en automaties.

## Installatie

1. HACS → Integraties → menu → *Aangepaste repositories* → voeg `https://github.com/BlazeOfFeathers/SolarMind` toe als *Integratie*.
2. Installeer **SolarMind** en herstart Home Assistant.
3. Instellingen → Apparaten & diensten → *Integratie toevoegen* → **SolarMind**.
4. Open **SolarMind** in de zijbalk:
   - *Instellingen*: kies je netvermogen-sensor (bv. P1 / HomeWizard, positief = afname) en optioneel je PV-sensor en voorspelling (Solcast / Forecast.Solar).
   - *Overzicht → Verbruiker toevoegen*: voeg je boilers en je laadpaal toe.

Handmatig kan ook: kopieer `custom_components/solarmind` naar je `config/custom_components`.

## Hoe de verdeling werkt

Elke 10 seconden:

1. `basis = netvermogen − vermogen van de gestuurde verbruikers` (wat het huis zou afnemen zonder je verbruikers; negatief = overschot).
2. Het overschot wordt van boven naar onder verdeeld. Een verbruiker die al draait, rekent met zijn gemeten vermogen.
3. Verbruikers die het net mogen gebruiken (*altijd aan*, nachtaanvulling, legionella, EV onder minimum-% of op minimaal laadvermogen) krijgen daarnaast de ruimte die de piekbewaking nog toelaat dit kwartier.
4. Start- en stopvertragingen en minimale looptijden worden toegepast. De piekbewaking grijpt meteen in.

## Thuisbatterij

Voeg een verbruiker toe met *Type: Thuisbatterij*. SolarMind stuurt elke cyclus één vermogen naar de batterij (+ laden, − ontladen) via entities van je omvormer-integratie (Huawei Solar, Sigenergy, Sungrow, Victron, Marstek, ...):

- **Uitlezen:** laadtoestand (%) en gemeten batterijvermogen, met keuze van het teken.
- **Sturen:** één `number` voor het vermogen (W of kW, met teken), of twee `number`s voor laad- en ontlaadvermogen. Optioneel een `select` die de omvormer in externe sturing zet en terug naar automatisch als SolarMind loslaat (modus Uit, verbruiker uitgeschakeld, sturing uit, geen netmeting of HA stopt).

Modi:

- *Zelfverbruik* (standaard): laadt met overschot op zijn plaats in de prioriteiten, en dekt 's avonds en 's nachts het huis.
- *Enkel zon*: laadt met overschot en ontlaadt alleen om een kwartierpiek op te vangen.
- *Zon + nacht*: zoals Zelfverbruik, en laadt 's nachts bij van het net tot het doel-% als de voorspelling voor morgen onder de drempel ligt.
- *Laden*: laadt meteen op vol vermogen tot het doel-%, ook van het net.
- *Uit*: SolarMind stuurt niets.

*Ontladen voor* bepaalt wat de batterij mag voeden: enkel het huis (standaard), huis + boilers, of alles (ook de auto). Een verbruiker in modus Zon krijgt nooit batterijstroom. Met *Piek opvangen* ontlaadt de batterij als het kwartiergemiddelde te hoog dreigt te worden, tot de piekreserve. Pas als de batterij dat niet meer kan, schakelt SolarMind verbruikers af. Netladen blijft altijd binnen de piekgrens.

In de analytics zie je geladen en ontladen kWh, het aandeel zon, het rendement, het aantal volle cycli en de besparing.

## Tesla via BLE HTTP proxy

Kies bij de verbruiker *Type: Laadpaal* en *Aansturing: Rechtstreeks via Tesla BLE HTTP proxy*, en vul de proxy-URL (bv. `http://192.168.1.50:8080`) en je VIN in. SolarMind leest `charge_state` elke minuut en gebruikt de commando's `charge_start`, `charge_stop` en `set_charging_amps`. Werkt je Tesla al in Home Assistant met een laadschakelaar en een laadstroom-`number`, dan kan je ook *Via Home Assistant entities* kiezen.

Tip: kies bij voorkeur ook een vermogenssensor (laadpaal of stekker). Dan rekent SolarMind met het echte vermogen in plaats van met ampère × spanning.

## Ontwikkeling

```bash
pip install -r requirements-dev.txt
pytest -q

cd frontend && npm install && npm run build   # bouwt custom_components/solarmind/frontend/solarmind-panel.js
```

**Nieuwe versie uitbrengen:** verhoog `version` in `manifest.json` en `VERSION` in `const.py`, en merge naar `main`. De workflow *Release* maakt dan automatisch de tag en GitHub-release `vX.Y.Z`, en HACS biedt de update aan.

## Op de planning

- Dynamische tarieven (ENTSO-E / Nordpool): nachtaanvulling in de goedkoopste uren, alles aan bij negatieve prijzen.
- Vertrektijd voor de EV ("om 7u minstens 50%").
- Thuisbatterij: laden in de goedkoopste uren bij een dynamisch tarief, en de vermeden capaciteitspiek in euro.
- Dashboardkaart.
