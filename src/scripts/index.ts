function setPageTitle(title: string): void {
    if(title.length>0) {
        document.title = `GitLab-Tools - ${title}`;
    } else {
        document.title = `GitLab-Tools`;
    }
}

window.onload = () => {
    const titles = document.getElementsByTagName('h1');
    setPageTitle(titles.item(0)?.textContent ?? '');
};
