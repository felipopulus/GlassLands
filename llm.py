# Description: Felipe's text generation script
import argparse
import json, os, random, sys
from collections import OrderedDict
# from modules import models
from modules.models import load_model
from modules.utils import get_available_models
# from modules import text_generation
from modules.text_generation import generate_reply_wrapper
from modules.models_settings import get_model_settings_from_yamls
from threading import Lock
import modules.shared as shared

# Shared variables
shared.generation_lock = Lock()
shared.args = argparse.Namespace(notebook=False, chat=False, multi_user=False, character=None, model=None, lora=None, model_dir='models/', lora_dir='loras/', model_menu=False, no_stream=False, settings=None, extensions=None, verbose=False, loader='AutoGPTQ', cpu=False, auto_devices=False, gpu_memory=None, cpu_memory=None, disk=False, disk_cache_dir='cache', load_in_8bit=False, bf16=False, no_cache=False, xformers=False, sdp_attention=False, trust_remote_code=False, load_in_4bit=False, compute_dtype='float16', quant_type='nf4', use_double_quant=False, threads=0, n_batch=512, no_mmap=False, mlock=False, cache_capacity=None, n_gpu_layers=0, n_ctx=2048, llama_cpp_seed=0.0, wbits=4, model_type='gptj', groupsize=128, pre_layer=None, checkpoint=None, monkey_patch=False, quant_attn=False, warmup_autotune=False, fused_mlp=False, gptq_for_llama=False, autogptq=False, triton=False, no_inject_fused_attention=False, no_inject_fused_mlp=False, no_use_cuda_fp16=False, desc_act=False, gpu_split='', max_seq_len=2048, compress_pos_emb=1, alpha_value=1, flexgen=False, percent=[0, 100, 100, 0, 100, 0], compress_weight=False, pin_weight=True, deepspeed=False, nvme_offload_dir=None, local_rank=0, rwkv_strategy=None, rwkv_cuda_on=False, listen=False, listen_host=None, listen_port=None, share=False, auto_launch=False, gradio_auth=None, gradio_auth_path=None, api=False, api_blocking_port=5000, api_streaming_port=5005, public_api=False, multimodal_pipeline=None)
# # shared.input_elements = ['max_new_tokens', 'seed', 'temperature', 'top_p', 'top_k', 'typical_p', 'epsilon_cutoff', 'eta_cutoff', 'repetition_penalty', 'repetition_penalty_range', 'encoder_repetition_penalty', 'no_repeat_ngram_size', 'min_length', 'do_sample', 'penalty_alpha', 'num_beams', 'length_penalty', 'early_stopping', 'mirostat_mode', 'mirostat_tau', 'mirostat_eta', 'add_bos_token', 'ban_eos_token', 'truncation_length', 'custom_stopping_strings', 'skip_special_tokens', 'stream', 'tfs', 'top_a', 'textbox', 'output_textbox', 'loader', 'cpu_memory', 'auto_devices', 'disk', 'cpu', 'bf16', 'load_in_8bit', 'trust_remote_code', 'load_in_4bit', 'compute_dtype', 'quant_type', 'use_double_quant', 'wbits', 'groupsize', 'model_type', 'pre_layer', 'triton', 'desc_act', 'no_inject_fused_attention', 'no_inject_fused_mlp', 'no_use_cuda_fp16', 'threads', 'n_batch', 'no_mmap', 'mlock', 'n_gpu_layers', 'n_ctx', 'llama_cpp_seed', 'gpu_split', 'max_seq_len', 'compress_pos_emb', 'alpha_value', 'gpu_memory_0']
# shared.is_seq2seq = False
shared.model_config = OrderedDict([('.*', {'wbits': 'None', 'model_type': 'None', 'groupsize': 'None', 'pre_layer': 0, 'mode': 'chat', 'skip_special_tokens': True, 'custom_stopping_strings': '', 'truncation_length': 2048}), ('.*(llama|alpac|vicuna|guanaco|koala|llava|wizardlm|metharme|pygmalion-7b|wizard-mega|openbuddy|vigogne|h2ogpt-research|manticore)', {'model_type': 'llama'}), ('.*(opt-|opt_|opt1|opt3|optfor|galactica|galpaca|pygmalion-350m)', {'model_type': 'opt'}), ('.*(gpt-j|gptj|gpt4all-j|malion-6b|pygway|pygmalion-6b|dolly-v1)', {'model_type': 'gptj'}), ('.*(gpt-neox|koalpaca-polyglot|polyglot.*koalpaca|polyglot-ko|polyglot_ko|pythia|stablelm|incite|dolly-v2|polycoder|h2ogpt-oig|h2ogpt-oasst1|h2ogpt-gm)', {'model_type': 'gpt_neox'}), ('.*llama', {'model_type': 'llama'}), ('.*bloom', {'model_type': 'bloom'}), ('llama-65b-gptq-3bit', {'groupsize': 'None'}), ('.*(4bit|int4)', {'wbits': 4}), ('.*(3bit|int3)', {'wbits': 3}), ('.*(-2bit|_2bit|int2-)', {'wbits': 2}), ('.*(-1bit|_1bit|int1-)', {'wbits': 1}), ('.*(8bit|int8)', {'wbits': 8}), ('.*(-7bit|_7bit|int7-)', {'wbits': 7}), ('.*(-6bit|_6bit|int6-)', {'wbits': 6}), ('.*(-5bit|_5bit|int5-)', {'wbits': 5}), ('.*(-gr32-|-32g-|groupsize32|-32g$)', {'groupsize': 32}), ('.*(-gr64-|-64g-|groupsize64|-64g$)', {'groupsize': 64}), ('.*(gr128|128g|groupsize128)', {'groupsize': 128}), ('.*(gr1024|1024g|groupsize1024)', {'groupsize': 1024}), ('.*(oasst|openassistant-|stablelm-7b-sft-v7-epoch-3)', {'mode': 'instruct', 'instruction_template': 'Open Assistant', 'skip_special_tokens': False}), ('(?!.*galactica)(?!.*reward).*openassistant', {'mode': 'instruct', 'instruction_template': 'Open Assistant', 'skip_special_tokens': False}), ('(?!.*v0)(?!.*1.1)(?!.*1_1)(?!.*stable)(?!.*chinese).*vicuna', {'mode': 'instruct', 'instruction_template': 'Vicuna-v0'}), ('.*vicuna.*v0', {'mode': 'instruct', 'instruction_template': 'Vicuna-v0'}), ('.*vicuna.*(1.1|1_1|1.3|1_3)', {'mode': 'instruct', 'instruction_template': 'Vicuna-v1.1'}), ('.*wizard.*vicuna', {'mode': 'instruct', 'instruction_template': 'Vicuna-v1.1'}), ('.*stable.*vicuna', {'mode': 'instruct', 'instruction_template': 'StableVicuna'}), ('(?!.*chat).*chinese-vicuna', {'mode': 'instruct', 'instruction_template': 'Alpaca'}), ('.*chinese-vicuna.*chat', {'mode': 'instruct', 'instruction_template': 'Chinese-Vicuna-Chat'}), ('.*alpaca', {'mode': 'instruct', 'instruction_template': 'Alpaca'}), ('.*alpaca-native-4bit', {'mode': 'instruct', 'instruction_template': 'Alpaca', 'wbits': 4, 'groupsize': 128}), ('.*galactica', {'skip_special_tokens': False}), ('.*dolly-v[0-9]-[0-9]*b', {'mode': 'instruct', 'instruction_template': 'Alpaca', 'skip_special_tokens': False, 'custom_stopping_strings': '"### End"'}), ('.*koala', {'mode': 'instruct', 'instruction_template': 'Koala'}), ('.*chatglm', {'mode': 'instruct', 'instruction_template': 'ChatGLM'}), ('.*metharme', {'mode': 'instruct', 'instruction_template': 'Metharme'}), ('.*llava', {'mode': 'instruct', 'model_type': 'llama', 'instruction_template': 'LLaVA', 'custom_stopping_strings': '"\\n###"'}), ('.*raven', {'mode': 'instruct', 'instruction_template': 'RWKV-Raven'}), ('.*moss-moon.*sft', {'mode': 'instruct', 'instruction_template': 'MOSS'}), ('.*stablelm-tuned', {'mode': 'instruct', 'instruction_template': 'StableLM', 'truncation_length': 4096}), ('.*stablelm-base', {'truncation_length': 4096}), ('.*wizardlm', {'mode': 'instruct', 'model_type': 'llama', 'instruction_template': 'WizardLM'}), ('.*galactica.*finetuned', {'mode': 'instruct', 'instruction_template': 'Galactica Finetuned'}), ('.*galactica.*-v2', {'mode': 'instruct', 'instruction_template': 'Galactica v2'}), ('(?!.*finetuned)(?!.*-v2).*galactica', {'mode': 'instruct', 'instruction_template': 'Galactica'}), ('.*guanaco', {'mode': 'instruct', 'instruction_template': 'Guanaco non-chat'}), ('.*baize', {'mode': 'instruct', 'instruction_template': 'Baize'}), ('.*mpt-.*instruct', {'mode': 'instruct', 'instruction_template': 'Alpaca'}), ('.*mpt-.*chat', {'mode': 'instruct', 'instruction_template': 'MPT-Chat'}), ('(?!.*-flan-)(?!.*-t5-).*lamini-', {'mode': 'instruct', 'instruction_template': 'Alpaca'}), ('.*incite.*chat', {'mode': 'instruct', 'instruction_template': 'INCITE-Chat'}), ('.*incite.*instruct', {'mode': 'instruct', 'instruction_template': 'INCITE-Instruct'}), ('.*wizard.*mega', {'mode': 'instruct', 'instruction_template': 'Wizard-Mega'}), ('.*ziya-', {'mode': 'instruct', 'instruction_template': 'Ziya'}), ('.*koalpaca', {'mode': 'instruct', 'instruction_template': 'KoAlpaca'}), ('.*openbuddy', {'mode': 'instruct', 'instruction_template': 'OpenBuddy'}), ('(?!.*chat).*vigogne', {'mode': 'instruct', 'instruction_template': 'Vigogne-Instruct'}), ('.*vigogne.*chat', {'mode': 'instruct', 'instruction_template': 'Vigogne-Chat'}), ('.*(llama-deus|supercot|llama-natural-instructions|open-llama-0.3t-7b-instruct-dolly-hhrlhf|open-llama-0.3t-7b-open-instruct)', {'mode': 'instruct', 'instruction_template': 'Alpaca'}), ('.*bactrian', {'mode': 'instruct', 'instruction_template': 'Bactrian'}), ('.*(h2ogpt-oig-|h2ogpt-oasst1-|h2ogpt-research-oasst1-)', {'mode': 'instruct', 'instruction_template': 'H2O-human_bot'}), ('.*h2ogpt-gm-', {'mode': 'instruct', 'instruction_template': 'H2O-prompt_answer'}), ('.*manticore', {'mode': 'instruct', 'instruction_template': 'Manticore Chat'}), ('.*bluemoonrp-(30|13)b', {'mode': 'instruct', 'instruction_template': 'Bluemoon', 'truncation_length': 4096}), ('.*Nous-Hermes-13b', {'mode': 'instruct', 'instruction_template': 'Alpaca'}), ('.*airoboros', {'mode': 'instruct', 'instruction_template': 'Vicuna-v1.1'}), ('.*WizardLM-30B-V1.0', {'mode': 'instruct', 'instruction_template': 'Vicuna-v1.1'}), ('TheBloke_WizardLM-30B-GPTQ', {'mode': 'instruct', 'instruction_template': 'Vicuna-v1.1'}), ('.*alpa(cino|sta)', {'mode': 'instruct', 'instruction_template': 'Alpaca'}), ('.*hippogriff', {'mode': 'instruct', 'instruction_template': 'Hippogriff'}), ('.*gpt4all-.*-snoozy', {'mode': 'instruct', 'instruction_template': 'WizardLM'}), ('.*lazarus', {'mode': 'instruct', 'instruction_template': 'Alpaca'}), ('.*guanaco-.*(7|13|33|65)b', {'mode': 'instruct', 'instruction_template': 'Guanaco'}), ('.*hypermantis', {'mode': 'instruct', 'instruction_template': 'Alpaca'}), ('.*open-llama-.*-open-instruct', {'mode': 'instruct', 'instruction_template': 'Alpaca'}), ('.*starcoder-gpteacher-code-instruct', {'mode': 'instruct', 'instruction_template': 'Alpaca'}), ('.*tulu', {'mode': 'instruct', 'instruction_template': 'Tulu'}), ('.*chronos', {'mode': 'instruct', 'instruction_template': 'Alpaca'}), ('.*samantha', {'mode': 'instruct', 'instruction_template': 'Samantha'}), ('.*wizardcoder', {'mode': 'instruct', 'instruction_template': 'Alpaca'}), ('.*starchat-beta', {'mode': 'instruct', 'instruction_template': 'Starchat-Beta'}), ('.*minotaur', {'mode': 'instruct', 'instruction_template': 'Minotaur'}), ('.*minotaur-15b', {'truncation_length': 8192}), ('.*orca_mini', {'mode': 'instruct', 'instruction_template': 'Orca Mini'}), ('.*landmark', {'truncation_length': 8192}), ('.*superhot-8k', {'truncation_length': 8192}), ('.*xgen.*-inst', {'truncation_length': 8192, 'instruction_template': 'Vicuna-v0'})])
shared.p = "models/config-user.yaml"


def start():
    # Load model
    availibleModels = get_available_models()
    print("Availible models:" + str(availibleModels))
    shared.model_name = availibleModels[1]
    # model_settings = get_model_settings_from_yamls(shared.model_name)
    print("Model Chosen: " + shared.model_name)
    print("Loading model...")
    shared.model, shared.tokenizer = load_model(shared.model_name)
    print("Model loaded.")
    return shared