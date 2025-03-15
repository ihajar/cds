import parse from "html-react-parser";
import santizeHtml from "sanitize-html";

export const HTMLParser = ({ html }: { html: string }) => {
    return parse(santizeHtml(html));
}