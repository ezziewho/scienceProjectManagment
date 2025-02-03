import puppeteer from "puppeteer";

const scrapeGrantsFromNCN = async () => {
    const url = "https://ncn.gov.pl/konkursy-krajowe";

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        );

        await page.goto(url, { waitUntil: "networkidle2" });

        const grants = await page.evaluate(() => {
            const monthMap = {
                "stycznia": "01",
                "lutego": "02",
                "marca": "03",
                "kwietnia": "04",
                "maja": "05",
                "czerwca": "06",
                "lipca": "07",
                "sierpnia": "08",
                "września": "09",
                "października": "10",
                "listopada": "11",
                "grudnia": "12",
            };

            function formatDate(dateString, format = "text") {
                if (format === "dot") {
                    const [day, month, year] = dateString.split(".");
                    return `${year}-${month}-${day.padStart(2, "0")}`;
                } else {
                    const parts = dateString.split(" ");
                    if (parts.length === 3) {
                        const day = parts[0].padStart(2, "0");
                        const month = monthMap[parts[1].toLowerCase()];
                        const year = parts[2];
                        return `${year}-${month}-${day}`;
                    }
                }
                return "";
            }

            const results = [];
            const sections = document.querySelectorAll("h3.rozwijanie");

            sections.forEach((section) => {
                const nameElement = section.querySelector("a");
                if (!nameElement) return;

                const nameParts = nameElement.innerText.split(" – ");
                const baseName = nameParts[0].trim(); // np. "OPUS"
                const description = nameParts.length > 1 ? nameParts[1].trim() : "";

                const listItems = section.nextElementSibling?.querySelectorAll("li");
                if (!listItems) return;

                listItems.forEach((item) => {
                    const text = item.innerText;
                    const linkElement = item.querySelector("a");
                    const detailsUrl = linkElement
                        ? `https://ncn.gov.pl${linkElement.getAttribute("href")}`
                        : "";

                    // ✨ Ignorowanie elementów bez numeru edycji ✨
                    const editionMatch = text.match(/(\d+)/);
                    if (!editionMatch) {
                        console.warn(`⚠️ Pominięto element bez numeru edycji: ${text}`);
                        return;
                    }

                    const editionNumber = ` ${editionMatch[1]}`; // np. " 1"

                    // Nowa pełna nazwa konkursu np. "Dioscuri 1"
                    const fullName = `${baseName}${editionNumber}`;

                    // ✨ Wyrażenie regularne do znalezienia dat ✨
                    const dateRegex =
                        /ogłoszony (\d{1,2} \w+ \d{4}) .* wniosków: do (\d{1,2}.\d{2}.\d{4})/;
                    const match = text.match(dateRegex);

                    let startDate = "";
                    let deadline = "";

                    if (match) {
                        startDate = formatDate(match[1]);
                        deadline = formatDate(match[2], "dot");
                    } else {
                        console.warn(`⚠️ Brak dat dla konkursu: ${fullName}, tekst: ${text}`);
                    }

                    results.push({
                        name: fullName, // Teraz zawiera numer edycji!
                        description,
                        details_url: detailsUrl,
                        start_date: startDate || "No start date found",
                        deadline: deadline || "No deadline found",
                        institution: "NCN",
                    });
                });
            });

            return results;
        });

        await browser.close();

        // Wyświetlenie wyników w konsoli w czytelnej formie JSON
        console.log(JSON.stringify(grants, null, 2));
    } catch (error) {
        console.error("❌ Błąd podczas scrapowania:", error);
    }
};

// Uruchomienie scrapera
scrapeGrantsFromNCN();
