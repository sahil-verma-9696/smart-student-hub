import { Image } from "antd";
import { LogoFilePond } from "./logo-filepond";

export function LogoUpload({
  currentLogo,
  onUpload,
  onRemove,
  editable = true,
}) {
  console.log(currentLogo, "currentLogo");
  return (
    <div className="space-y-3">
      {editable && (
        <LogoFilePond
          folderName="institute-logo"
          currentLogo={currentLogo}
          onUpload={(logoPayload) => onUpload(logoPayload)}
          onRemove={() => onRemove()}
        />
      )}
      {!editable && <Image src={currentLogo.url} width={200} />}
    </div>
  );
}
