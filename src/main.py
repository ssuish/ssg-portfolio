import os
import shutil
from generate_page import generate_page


def copy_files(source_dir, dest_dir):
    for i in os.listdir(source_dir):
        source = os.path.join(source_dir, i)
        dest = os.path.join(dest_dir, i)

        print(f"Copying {source} to {dest}")

        if os.path.isfile(source):
            shutil.copy(source, dest)
        else:
            os.mkdir(dest)
            copy_files(source, dest)


def static_to_public():
    public_dir_abs = os.path.abspath("./public")
    static_dir_abs = os.path.abspath("./static")

    if os.path.exists(public_dir_abs):
        shutil.rmtree(public_dir_abs)
    os.makedirs(public_dir_abs, exist_ok=True)

    copy_files(static_dir_abs, public_dir_abs)


def generate_page_recursive(from_dir, template, dest_dir):
    for fp in os.listdir(from_dir):
        from_path = os.path.join(from_dir, fp)
        dest_path = os.path.join(dest_dir, fp)

        if os.path.isfile(from_path):
            new_dest = dest_path.replace(".md", ".html")
            generate_page(from_path, template, new_dest)
        else:
            generate_page_recursive(from_path, template, dest_path)

def main():
    public_dir_abs = os.path.abspath("./public")
    dir_path_content = os.path.abspath("./content")
    template_path = os.path.abspath("./template.html")

    static_to_public()
    generate_page_recursive(
        dir_path_content,
        template_path,
        public_dir_abs,
    )


if __name__ == "__main__":
    main()
