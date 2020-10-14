# Open Data Process Guide

We are the Team **Open Data Portal** of the [2020 Tech4Germany fellowship](https://tech.4germany.org/fellowship-2020/) (from left to right in the picture):
- [Tjorven Rohwer](https://www.linkedin.com/in/tjorvenrohwer/)
- [Nele Lüpkes](https://www.linkedin.com/in/nelel%C3%BCpkes/), [@SplitSeconds](https://github.com/SplitSeconds)
- [Daniela Vogel](https://www.linkedin.com/in/daniela-vogel/), [@Dangerousdani](https://github.com/Dangerousdani)
- [Benjamin Degenhart](https://www.linkedin.com/in/bdegenhart/), [@benjaminaaron](https://github.com/benjaminaaron)

<img src="https://user-images.githubusercontent.com/5141792/93686296-98ee4c80-fab5-11ea-877d-9ecf9dfbb2f7.jpg">

## Deployment in SharePoint

For deploying the web part in a SharePoint environment, we signed up for an online-version offered by Microsoft: "Microsoft 365 Business Standard" (Für Unternehmen) on [this](https://www.microsoft.com/de-de/microsoft-365/business/compare-all-microsoft-365-business-products?tab=2&market=de) site (10,5€ user/month after a 1-month trial).

### Steps taken after setting the above up:

- If multi-factor authentication is on by default, it can be turned off (to make guest-user logins easier) in the "Azure Active Directory admin center" > Dashboard > Properties ([direct link](https://aad.portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Properties)) > at the bottom click on "Manage Security defaults" and then move the slider to "No".

- Create an "App Catalog" site to deploy the web part to your SharePoint following [these instructions](https://docs.microsoft.com/en-us/sharepoint/use-app-catalog).

- Deploy this web part into that App Catalog following [these instructions](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/hosting-webpart-from-office-365-cdn).

- Add it to a site.

- To set the permissions for sharing files and folders from SharePoint to "anyone with the link" (= no login required, by default this is not allowed), follow the [instructions here](https://docs.microsoft.com/en-US/sharepoint/change-external-sharing-site).

- To allow emailing users within the organization via *PnPjs*, they need to be members of the SharePoint page in question. For that, add the respective emails at `<SharePoint_Page>/_layouts/15/people.aspx?MembershipGroupId=5`, in our case that is [this link](https://opendataprocess.sharepoint.com/sites/Guido/_layouts/15/people.aspx?MembershipGroupId=5).

### Degrees of Deployment

TODO

Add `_layouts/workbench.aspx` to your SharePoint site URL.

## Setup

The skeleton for the web part was created using `yo @microsoft/sharepoint`, following the tutorial [here](point/dev/spfx/web-parts/get-started/build-a-hello-world-web-part). More info in the respective [commit message](https://github.com/tech4germany/open-data-process-guide/commit/d3f418f64628d94720e3f6f8749c4c67d72d0eb3).

```sh
# node v10.13.0
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
source ~/.bashrc
nvm install 10.13.0
nvm use v10.13.0

npm install gulp --global
npm install
```

## Run

```sh
gulp serve
```

---

<details>

<summary>fold out example</summary>

Cool right?! :sunglasses:

</details>
