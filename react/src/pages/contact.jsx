import { EnvelopeSimple, Phone } from "@phosphor-icons/react"
import "./contact.css"

export const Contact = () => {
    return (
        <div>
            <div className="contactGroup">
                <EnvelopeSimple className="contactIcon" />
                <div> e-learn@gmail.com </div>
            </div>
            <div className="contactGroup">
                <Phone className="contactIcon" />
                <div> +40748724128 </div>
            </div>
            <div className="contactUs"> Contact Us </div>

        </div>
    )
}