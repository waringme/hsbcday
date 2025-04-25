function getMetadata(name) {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const meta = [...document.querySelectorAll(`meta[${attr}="${name}"]`)]
    .map((m) => m.content)
    .join(', ');
  return meta || '';
}

//const aem = "http://localhost:4503";
//const aem = "https://publish-p107058-e1001010.adobeaemcloud.com";
const aem = "https://publish-p143018-e1469341.adobeaemcloud.com";
const cors = "https://cors.cpilsworth.workers.dev/?target=";

export default function decorate(block) {

  const slugID = document.createElement('div');
  slugID.id = 'slug';
  slugID.textContent = block.querySelector('div:nth-child(1)').textContent.trim();
  block.querySelector('div:nth-child(1)').replaceWith(slugID);

  const destinationDiv = document.createElement('div');
  destinationDiv.id = `destination-${slugID.textContent}`;
  block.querySelector('div:last-of-type').replaceWith(destinationDiv);

  const urlEndpoint = cors + aem + "/graphql/execute.json/hsbc/getPageBySlugAndVariation;slug=" + slugID.textContent;
  console.log(urlEndpoint);

// fetch('https://cors.cpilsworth.workers.dev/?target=https://publish-p150634-e1553296.adobeaemcloud.com/graphql/execute.json/nationwide/mortgage-offer-by-slug;slug=offer-1')

 fetch(urlEndpoint)
    .then(response => response.json())
    .then(response => {
      const {  image, cta, title, description} = response.data.assessmentList.items[0];
      const imageURL = `${aem}${image._dynamicUrl}`;
console.log("CTA");
console.log(cta);
console.log("BODY");
console.log(description.html);

      destinationDiv.innerHTML = `
        <div class='destination-image'>
          <img src="${imageURL}" alt="ssssssssssss">
        </div>
        <div class='destination-content'>
          <div class='destination-content-title'><h3>${cta}</h3></div>

         <div class='destination-content-subtitle'>${description.html}</div>


        </div>
      `;
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });

}