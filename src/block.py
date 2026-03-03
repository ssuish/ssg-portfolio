import re
from enum import Enum


class BlockType(Enum):
    PARAGRAPH = "paragraph"
    HEADING = "heading"
    CODE = "code"
    QUOTE = "quote"
    UNORDERED_LIST = "unordered_list"
    ORDERED_LIST = "ordered_list"


def markdown_to_blocks(markdown):
    blocks = markdown.split("\n\n")
    result = []
    for block in blocks:
        block = block.strip()

        if not block:
            continue

        lines = [x.strip() for x in block.split("\n")]
        result.append("\n".join(lines))

    return result


def block_to_block_type(block):
    lines = block.split("\n")

    if re.search(r"^#{1,6} .+", block):
        return BlockType.HEADING

    if len(lines) > 1 and block.startswith("```/n") and block.endswith("```"):
        return BlockType.CODE

    if lines[0].startswith(">"):
        for l in lines[1:]:
            if not l.startswith(">"):
                return BlockType.PARAGRAPH
        return BlockType.QUOTE

    if lines[0].startswith("- "):
        for l in lines[1:]:
            if not l.startswith("- "):
                return BlockType.PARAGRAPH
        return BlockType.UNORDERED_LIST

    if block.startswith("1. "):
        i = 1
        for l in lines:
            if not l.startswith(f"{i}. "):
                return BlockType.PARAGRAPH
            i += 1
        return BlockType.ORDERED_LIST

    return BlockType.PARAGRAPH
