var client = ZAFClient.init();
client.invoke('resize', { width: '100%', height: '400px' });

async function fetchMissionData() {
  try {
    const response = await fetch("./data/missions.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Could not fetch or parse the JSON:", error);
    renderError(error)
    return null;
  }
}

async function getMissionDetails(missionId) {
  try {
    const data = await fetchMissionData();
    const mission = data.find(m => m.mission === missionId);
    return mission;
  } catch (error) {
    console.error(error);
    renderError(error)
    return null
  }
}

async function getMissionId(description) {
  let match = description.match(/"courseMissionId"\s*:\s*"([^"|]+)\|([^"]+)"/);

  if (match) {
    const missionId = match[1];
    const missionLanguage = match[2];

    const missionDetails = await getMissionDetails(missionId);

    const container = document.getElementById("content-container")
    const outerDiv = document.createElement("div")
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');

    const nameSpan = document.createElement('span');
    nameSpan.textContent = `ID: ${missionId}`;
    nameSpan.classList.add("ellipsis")
    
    const languageSpan = document.createElement('span');
    languageSpan.textContent = `Language: ${missionLanguage}`;
    languageSpan.classList.add('ellipsis');

    const link = document.createElement('a');
    link.textContent = "Play lab in explore";
    link.classList.add('btn');
    link.href = `https://internal.dev.nonprod.securecodewarrior.com/mission/${missionId}/${missionLanguage}`;
    link.setAttribute('target', '_blank');
    link.style.display = "inline-block";

    if (missionDetails) {
      console.log(missionDetails)
      const aliasSpan = document.createElement('span');
      aliasSpan.textContent = `Alias: ${missionDetails.alias}`;
      
      const difficultySpan = document.createElement('span');
      difficultySpan.textContent = `Alias: ${missionDetails.difficulty}`;
      
      const categorySpan = document.createElement('span');
      categorySpan.textContent = `Type: ${missionDetails.category} - ${missionDetails.subcategory}`;
      
      cardDiv.appendChild(aliasSpan);
      cardDiv.appendChild(languageSpan);
      cardDiv.appendChild(difficultySpan);
      cardDiv.appendChild(categorySpan);
    } else {
      cardDiv.appendChild(nameSpan);
      cardDiv.appendChild(languageSpan);
    }

    cardDiv.appendChild(link);
    outerDiv.appendChild(cardDiv);
    container.appendChild(outerDiv);

    return true;
  } else {
    return false;
  }
}

async function getCodingLabId(description) {
  match = description.match(/"challengeId"\s*:\s*"([^"]+)"/);

  if (match) {
    const codingLabId = match[1];
    const container = document.getElementById("content-container")
    const outerDiv = document.createElement("div")
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');

    const nameSpan = document.createElement('span');
    nameSpan.textContent = `Coding Lab: ${codingLabId}`;

    const link = document.createElement('a');
    link.textContent = "Play lab in explore";
    link.classList.add('btn');
    link.href = `https://portal.securecodewarrior.com/#/explore/coding-lab/${codingLabId}`;
    link.setAttribute('target', '_blank');
    link.style.display = "inline-block";

    cardDiv.appendChild(nameSpan);
    cardDiv.appendChild(link);
    outerDiv.appendChild(cardDiv);
    container.appendChild(outerDiv);

    return true;
  } else {
    return false;
  }
}

async function getChallengeId(description) {
  match = description.match(/"revisionId"\s*:\s*"([a-f0-9]{24})"/);

  if (match) {
    console.log(match[1])
    const challengeId = match[1];
    const container = document.getElementById("content-container")
    const outerDiv = document.createElement("div")
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');

    const nameSpan = document.createElement('span');
    nameSpan.textContent = `Challenge: ${challengeId}`;
    nameSpan.classList.add('ellipsis');

    const link = document.createElement('a');
    link.textContent = "View challenge in CMS";
    link.classList.add('btn');
    link.href = `https://cms.securecodewarrior.com/search?q=${challengeId}`;
    link.setAttribute('target', '_blank');
    link.style.display = "inline-block";

    cardDiv.appendChild(nameSpan);
    cardDiv.appendChild(link);
    outerDiv.appendChild(cardDiv);
    container.appendChild(outerDiv);

    return true;
  } else {
    return false;
  }
}

async function renderError(text) {
  const container = document.getElementById("content-container")
  const cardDiv = document.createElement('div');
  cardDiv.classList.add('card');

  const nameSpan = document.createElement('span');
  nameSpan.textContent = text;

  cardDiv.appendChild(nameSpan);
  container.appendChild(cardDiv);
}

async function loadTicketData() {
    try {
      const ticketData = await client.get(["ticket.description"]);
      const description = ticketData["ticket.description"];

      if (description) {
        const foundMission = await getMissionId(description);
        const foundCodingLab = await getCodingLabId(description);
        const foundChallenge = await getChallengeId(description);

        const contentFound = foundMission || foundCodingLab || foundChallenge;
        
        if (!contentFound) {
          renderError("No content IDs found in ticket")
        }
      }
    } catch (error) {
      renderError("Error fetching ticket data")
      console.error("Error fetching ticket data:", error);
    }
}

loadTicketData();