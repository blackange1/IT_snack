from .text import Text
from .choice import Choice
from .choice_multi import ChoiceMulti
from .code import Code
from .video import Video

STEP_LIST = {
    'text': Text,
    'choice': Choice,
    'choicemulti': ChoiceMulti,
    'code': Code,
    'video': Video,
}

TYPE_STEPS = list(STEP_LIST.keys())

LESSON_METHODS = [f'{item}_set' for item in TYPE_STEPS]
