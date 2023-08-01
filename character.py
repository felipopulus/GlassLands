
import os
import json
from modules.text_generation import generate_reply_wrapper
from modules.models_settings import get_model_settings_from_yamls

state = {'max_new_tokens': 500, 'seed': -1.0, 'temperature': 0.7, 'top_p': 0.9, 'top_k': 20, 'typical_p': 1, 'epsilon_cutoff': 0, 'eta_cutoff': 0, 'repetition_penalty': 1.15, 'repetition_penalty_range': 0, 'encoder_repetition_penalty': 1, 'no_repeat_ngram_size': 0, 'min_length': 0, 'do_sample': True, 'penalty_alpha': 0, 'num_beams': 1, 'length_penalty': 1, 'early_stopping': False, 'mirostat_mode': 0, 'mirostat_tau': 5, 'mirostat_eta': 0.1, 'add_bos_token': True, 'ban_eos_token': False, 'truncation_length': 2048, 'custom_stopping_strings': '', 'skip_special_tokens': True, 'stream': True, 'tfs': 1, 'top_a': 0, 'textbox': 'Question: How do you go from 0 to 60 in a car?\nFactual answer:', 'output_textbox': 'Question: How do you go from 0 to 60 in a car?\nFactual answer:', 'loader': 'AutoGPTQ', 'cpu_memory': 0, 'auto_devices': False, 'disk': False, 'cpu': False, 'bf16': False, 'load_in_8bit': False, 'trust_remote_code': False, 'load_in_4bit': False, 'compute_dtype': 'float16', 'quant_type': 'nf4', 'use_double_quant': False, 'wbits': 4, 'groupsize': 128, 'model_type': 'gptj', 'pre_layer': 0, 'triton': False, 'desc_act': False, 'no_inject_fused_attention': False, 'no_inject_fused_mlp': False, 'no_use_cuda_fp16': False, 'threads': 0, 'n_batch': 512, 'no_mmap': False, 'mlock': False, 'n_gpu_layers': 0, 'n_ctx': 2048, 'llama_cpp_seed': 0.0, 'gpu_split': '', 'max_seq_len': 4096, 'compress_pos_emb': 1, 'alpha_value': 1, 'gpu_memory_0': 0}

CHARACTERS = {
    "Banker": {"position": {"x": 0, "y": 0.05}, "type": "ai", "color": "#0000FF", "name": "John", "age": 46, "profession": "Banker"},
    "Butcher": {"position": {"x": 0.2, "y": 0.05}, "type": "ai", "color": "#1000FF", "name": "Archimides", "age": 32, "profession": "Butcher"},
    "Baker": {"position": {"x": 0.4, "y": 0.05}, "type": "ai", "color": "#2000FF", "name": "Jenny", "age": 22, "profession": "Baker"},
    "Doctor": {"position": {"x": 0.6, "y": 0.05}, "type": "ai", "color": "#3000FF", "name": "Dr. Smith", "age": 56, "profession": "Doctor"},
    "Nurse": {"position": {"x": 0.8, "y": 0.05}, "type": "ai", "color": "#4000FF", "name": "Betty", "age": 28, "profession": "Nurse"},
    "Teacher": {"position": {"x": 1, "y": 0.05}, "type": "ai", "color": "#5000FF", "name": "Ms. Jones", "age": 32, "profession": "Teacher"},
    "Student": {"position": {"x": 0, "y": 0.3}, "type": "ai", "color": "#6000FF", "name": "Timmy", "age": 12, "profession": "Student"},
    "Lawyer": {"position": {"x": 0.2, "y": 0.3}, "type": "ai", "color": "#7000FF", "name": "Mr. Esquire", "age": 56, "profession": "Lawyer"},
    "Police Officer": {"position": {"x": 0.4, "y": 0.3}, "type": "ai", "color": "#8000FF", "name": "Officer Jones", "age": 32, "profession": "Police Officer"},
    "Firefighter": {"position": {"x": 0.6, "y": 0.3}, "type": "ai", "color": "#9000FF", "name": "Lucious", "age": 30, "profession": "Firefighter"},
    "Chef": {"position": {"x": 0.8, "y": 0.3}, "type": "ai", "color": "#A000FF", "name": "Chef Boyardee", "age": 29, "profession": "Chef"},
    "Waitress": {"position": {"x": 1, "y": 0.3}, "type": "ai", "color": "#B000FF", "name": "Sally", "age": 23, "profession": "Waitress"},
    "Barista": {"position": {"x": 0, "y": 0.6}, "type": "ai", "color": "#C000FF", "name": "Sussie", "age": 19, "profession": "Barista"},
    "Librarian": {"position": {"x": 0.2, "y": 0.6}, "type": "ai", "color": "#D000FF", "name": "Ms. Dewey", "age": 50, "profession": "Librarian"},
    "Construction Worker": {"position": {"x": 0.4, "y": 0.6}, "type": "ai", "color": "#E000FF", "name": "Bob", "age": 40, "profession": "Construction Worker"},
    "Electrician": {"position": {"x": 0.6, "y": 0.6}, "type": "ai", "color": "#F000FF", "name": "Mr. Watts", "age": 35, "profession": "Electrician"},
    "Plumber": {"position": {"x": 0.8, "y": 0.6}, "type": "ai", "color": "#FF00FF", "name": "Mr. Pipes", "age": 30, "profession": "Plumber"},
    "3D Artist": {"position": {"x": 1, "y": 0.6}, "type": "ai", "color": "#FF00E0", "name": "Mr. Blender", "age": 25, "profession": "3D Artist"},
    "Computer Programmer": {"position": {"x": 0, "y": 0.9}, "type": "ai", "color": "#FF00D0", "name": "Ms. C", "age": 29, "profession": "Computer Programmer"},
    "Graphic Designer": {"position": {"x": 0.2, "y": 0.9}, "type": "ai", "color": "#FF00C0", "name": "Caroline", "age": 27, "profession": "Graphic Designer"},
    "Artist": {"position": {"x": 0.4, "y": 0.9}, "type": "ai", "color": "#FF00B0", "name": "Alessandra", "age": 24, "profession": "Artist"},
    "Musician": {"position": {"x": 0.6, "y": 0.9}, "type": "ai", "color": "#FF00A0", "name": "Pianolo", "age": 22, "profession": "Musician"},
    "Writer": {"position": {"x": 0.8, "y": 0.9}, "type": "ai", "color": "#FF0090", "name": "Ms. Words", "age": 51, "profession": "Writer"},
    "Animator": {"position": {"x": 1, "y": 0.9}, "type": "ai", "color": "#FF0080", "name": "Tim", "age": 28, "profession": "Animator"}
    }

# CHARACTERS = {
#     "Ralph": {"position": {"x": 0, "y": 0.05}, "type": "ai", "name": "Ralph", "age": 41,
#         "traits": {"mental illness": "Borderline Personality Disorder"}},
#     "Golondrina": {"position": {"x": 0.2, "y": 0.05}, "type": "ai", "name": "Golondrina", "age": 37, 
#         "traits": {"mental illness": "Autism"}},
#     "Jenny": {"position": {"x": 0.4, "y": 0.05}, "type": "ai", "name": "Jenny", "age": 22,
#         "traits": {"mental illness": "Major Depressive Disorder"}},
#     "Jason": {"position": {"x": 0.6, "y": 0.05}, "type": "ai", "name": "Mandy", "age": 56,
#         "traits": {"mental illness": "Severe Depression"}},
#     "Betty": {"position": {"x": 0.8, "y": 0.05}, "type": "ai", "name": "Betty", "age": 28,
#         "traits": {"mental illness": "Generalized Anxiety Disorder"}},
#     "Ms. Jones": {"position": {"x": 1, "y": 0.05}, "type": "ai", "name": "Ms. Jones", "age": 32,
#         "traits": {"mental illness": "Dissociative Identity Disorder"}},
#     "Timmy": {"position": {"x": 0, "y": 0.3}, "type": "ai", "name": "Timmy", "age": 47,
#         "traits": {"mental illness": "post traumatic stress disorder"}},
#     "Roterdam": {"position": {"x": 0.2, "y": 0.3}, "type": "ai", "name": "Roterdam", "age": 56,
#         "traits": {"mental illness": "schizophrenia"}},
#     "Gloria": {"position": {"x": 0.4, "y": 0.3}, "type": "ai", "name": "Gloria", "age": 32,
#         "traits": {"mental illness": "Bipolar Disorder"}},
#     "Lucious": {"position": {"x": 0.6, "y": 0.3}, "type": "ai", "name": "Lucious", "age": 30,
#         "traits": {"mental illness": "Obsessive Compulsive Disorder"}},
#     "Archimides": {"position": {"x": 0.8, "y": 0.3}, "type": "ai", "name": "Archimides", "age": 29,
#         "traits": {"mental illness": "Attention Deficit Hyperactivity Disorder"}},
#     "Sally": {"position": {"x": 1, "y": 0.3}, "type": "ai", "name": "Sally", "age": 23,
#         "traits": {"mental illness": "Eating Disorder"}},
#     "Sussie": {"position": {"x": 0, "y": 0.6}, "type": "ai", "name": "Sussie", "age": 19,
#         "traits": {"mental illness": "Substance Abuse Disorder"}},
#     "Ms. Dewey": {"position": {"x": 0.2, "y": 0.6}, "type": "ai", "name": "Ms. Dewey", "age": 50,
#         "traits": {"mental illness": "Postpartum Depression"}},
#     "Bob": {"position": {"x": 0.4, "y": 0.6}, "type": "ai", "name": "Bob", "age": 40,
#         "traits": {"mental illness": "Social Anxiety Disorder"}},
#     "Mr. Watts": {"position": {"x": 0.6, "y": 0.6}, "type": "ai", "name": "Mr. Watts", "age": 35,
#         "traits": {"mental illness": "Panic Disorder"}},
#     "Mr. Pipes": {"position": {"x": 0.8, "y": 0.6}, "type": "ai", "name": "Mr. Pipes", "age": 30,
#         "traits": {"mental illness": "Antisocial Personality Disorder "}},
#     "Mr. Blender": {"position": {"x": 1, "y": 0.6}, "type": "ai", "name": "Mr. Blender", "age": 25,
#         "traits": {"mental illness": "Post Traumatic Stress Disorder"}},
#     "Ms. C": {"position": {"x": 0, "y": 0.9}, "type": "ai", "name": "Ms. C", "age": 29,
#         "traits": {"mental illness": "Schizoaffective Disorder"}},
#     "Caroline": {"position": {"x": 0.2, "y": 0.9}, "type": "ai", "name": "Caroline", "age": 27,
#         "traits": {"mental illness": "Schizotypal Personality Disorder"}},
#     "Alessandra": {"position": {"x": 0.4, "y": 0.9}, "type": "ai", "name": "Alessandra", "age": 24,
#         "traits": {"mental illness": "Insomnia Disorder"}},
#     "Pianolo": {"position": {"x": 0.6, "y": 0.9}, "type": "ai", "name": "Pianolo", "age": 22,
#         "traits": {"mental illness": "Narcissistic Personality Disorder"}},
#     "Ms. Words": {"position": {"x": 0.8, "y": 0.9}, "type": "ai", "name": "Ms. Words", "age": 51,
#         "traits": {"mental illness": "Avoidant Personality Disorder"}},
#     "Tim": {"position": {"x": 1, "y": 0.9}, "type": "ai", "name": "Tim", "age": 28,
#         "traits": {"mental illness": "Dependent Personality Disorder"}},
#     }


class Character():
    charNameOptions = [
        "Banker", 
        "Butcher", 
        "Baker", 
        "Doctor",
        "Nurse",
        "Teacher",
        "Student",
        "Lawyer",
        "Police Officer",
        "Firefighter",
        "Chef",
        "Waitress",
        "Barista",
        "Librarian",
        "Construction Worker",
        "Electrician",
        "Plumber",
        "3D Artist",
        "Computer Programmer",
        "Graphic Designer",
        "Artist",
        "Musician",
        "Writer",
        "Doctor"]

    
    def __init__(self, charId):
        self.charId = charId
        self.charName = self.charNameOptions[charId-1]
        self.json = os.path.join(os.path.dirname(__file__), "characters", self.charName + ".json")
        self.loadHistory()
    
    def getDefaultHistory(self):
        return {
            "name": self.charName,
            "actionHistory": [],
            "conversationHistory": {"User": ""},
            "address": "",
            "currentAction": "",
            "characterPrompt": "You are character in a small town and your profession is {}. You are an expert in your field. You will have conversations with other people in the town.\n".format(self.charName)
        }

    def loadHistory(self):
        if not os.path.exists(self.json):
            self.history = self.getDefaultHistory()
            self.saveHistory()

        # Load history from json
        with open(self.json, "r") as f:
            self.history = json.load(f)
    
    def talk(self, userPrompt):
        charPrompt = self.history["characterPrompt"]
        userHistory = self.history["conversationHistory"]["User"]
        conversation = charPrompt + userHistory
        conversation += "User: " + userPrompt + "\n" + self.charName + ": "
        reply = generate_reply_wrapper(conversation, state)

        lastToken = ""
        for token in reply:
            newToken = token[0]
            newToken = newToken.replace(lastToken, "")
            lastToken = token[0]
            newToken = newToken.replace(charPrompt, "")
            newToken = newToken.replace(userHistory, "")
            yield self.makeHtml(newToken)
            
        conversation = lastToken + "\n"
        conversation = conversation.replace(charPrompt, "")
        self.history["conversationHistory"]["User"] = conversation
        self.saveHistory()
    
    def saveHistory(self):
        with open(self.json, "w") as f:
            json.dump(self.history, f, indent=4)

    def makeHtml(self, token):
        token = token.replace("\n", "<br>")
        token = token.replace(self.charName, "<b>" + self.charName + "</b>")
        token = token.replace("User", "<b>User</b>")
        return token