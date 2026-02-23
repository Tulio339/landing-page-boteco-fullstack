$(function () {
  const $html = $("html");
  const $navbar = $("#navbar-principal");
  const $backToTopBtn = $("#back-to-top");
  const $animatedElements = $(".animate-on-scroll");

  // 1) Tema
  const $themeToggleBtn = $("#theme-toggle");
  const $themeIcon = $themeToggleBtn.find("i");

  function updateIcon(currentTheme) {
    if (currentTheme === "dark") {
      $themeIcon.removeClass("bi-moon-stars-fill").addClass("bi-sun-fill");
    } else {
      $themeIcon.removeClass("bi-sun-fill").addClass("bi-moon-stars-fill");
    }
  }

  const savedTheme = localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  $html.attr("data-bs-theme", savedTheme);
  updateIcon(savedTheme);

  $themeToggleBtn.on("click", function () {
    const currentTheme = $html.attr("data-bs-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    $html.attr("data-bs-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateIcon(newTheme);
  });

  // 2) Rolagem suave
  $("a.nav-link").on("click", function (e) {
    e.preventDefault();
    const target = $(this).attr("href");
    const offsetTop = $(target).offset().top - 70;
    $("html, body").animate({ scrollTop: offsetTop }, 100);
  });

  // 3) Fade-in inicial dos cards
  $(".card").hide().each(function (i) {
    $(this).delay(150 * i).fadeIn(100);
  });
  
  // 4) Navbar com efeito ao rolar
  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 50) {
      $navbar.addClass("navbar-scrolled");
    } else {
      $navbar.removeClass("navbar-scrolled");
    }
  });

  // 5) Botão "Voltar ao Topo"
  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 300) {
      $backToTopBtn.fadeIn();
    } else {
      $backToTopBtn.fadeOut();
    }
  });
  $backToTopBtn.on("click", function (e) {
    e.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, 100);
  });

  // 6) Revelar ao rolar
  function revealOnScroll() {
    const windowHeight = $(window).height();
    const windowTopPosition = $(window).scrollTop();
    const windowBottomPosition = windowTopPosition + windowHeight;

    $animatedElements.each(function () {
      const $element = $(this);
      const elementHeight = $element.outerHeight();
      const elementTopPosition = $element.offset().top;
      const elementBottomPosition = elementTopPosition + elementHeight;

      if (elementBottomPosition >= windowTopPosition && elementTopPosition <= windowBottomPosition) {
        $element.addClass("is-visible");
      }
    });
  }
  $(window).on("scroll load", revealOnScroll);

// ===============================================
// Login, Cadastro e Gestão de Conta com PHP
// ===============================================
const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
const accountModal = new bootstrap.Modal(document.getElementById("accountModal"));
const deleteConfirmModal = new bootstrap.Modal(document.getElementById("deleteConfirmModal"));

const $btnLogin = $("#btn-login");
const $userDropdown = $("#user-dropdown");
const $userNamePlaceholder = $("#user-name-placeholder");
const $btnLogout = $("#btn-logout");

// Função para atualizar a UI (botão de login ou dropdown do usuário)
function updateUserStatus(isLoggedIn, userName = '') {
    if (isLoggedIn) {
        $userNamePlaceholder.text(userName);
        $btnLogin.addClass('d-none');
        $userDropdown.removeClass('d-none');
    } else {
        $btnLogin.removeClass('d-none');
        $userDropdown.addClass('d-none');
    }
}

// 1. Checa a sessão ao carregar a página
$.ajax({
    url: 'api/check_session.php',
    method: 'GET',
    dataType: 'json',
    success: function (response) {
        if (response.status === 'loggedin') {
            updateUserStatus(true, response.userName);
        } else {
            updateUserStatus(false);
        }
    }
});

// 2. Ação do botão de Logout
$btnLogout.on("click", function (e) {
    e.preventDefault();
    $.ajax({
        url: 'api/logout.php',
        method: 'POST',
        dataType: 'json',
        success: function (response) {
            if (response.status === 'success') {
                updateUserStatus(false);
            }
        }
    });
});

// 3. Submissão do Formulário de LOGIN
$("#loginForm").on("submit", function (e) {
  e.preventDefault();
  $.ajax({
      url: 'api/login.php',
      method: 'POST',
      data: {
          emailOrUser: $("#loginEmail").val(),
          password: $("#loginPassword").val()
      },
      dataType: 'json',
      success: function(response) {
          if (response.status === 'success') {
              $("#loginError").addClass("d-none");
              loginModal.hide();
              updateUserStatus(true, response.userName);
          } else {
              $("#loginError").text(response.message).removeClass("d-none");
          }
      },
      error: function() {
          $("#loginError").text("Ocorreu um erro de comunicação.").removeClass("d-none");
      }
  });
});

// 4. Submissão do Formulário de CADASTRO
$("#registerForm").on("submit", function (e) {
    e.preventDefault();
    $("#registerSuccess, #registerError").addClass("d-none");

    const password = $("#registerPassword").val();
    const confirmPassword = $("#registerConfirmPassword").val();
    if (password !== confirmPassword) {
        $("#registerError").text("As senhas não coincidem!").removeClass("d-none");
        return;
    }

    $.ajax({
        url: 'api/register.php',
        method: 'POST',
        data: $(this).serialize(),
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                $("#registerSuccess").text(response.message).removeClass("d-none");
                $("#registerForm")[0].reset();
                $('#loginTab button[data-bs-target="#tab-login"]').tab('show');
            } else {
                $("#registerError").text(response.message).removeClass("d-none");
            }
        },
        error: function() {
            $("#registerError").text("Ocorreu um erro de comunicação.").removeClass("d-none");
        }
    });
});

// 5. Carregar dados do usuário no modal "Minha Conta"
$('#accountModal').on('show.bs.modal', function () {
    $.ajax({
        url: 'api/get_user.php',
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            if(response.status === 'success'){
                $('#accountFullName').val(response.data.nome_completo);
                $('#accountEmail').val(response.data.email);
                $('#accountPhone').val(response.data.telefone);
                $('#accountAddress').val(response.data.endereco);
                $('#accountBirthdate').val(response.data.data_nascimento);
            }
        }
    });
});

// 6. Submissão do Formulário de ATUALIZAÇÃO de perfil
$("#updateProfileForm").on("submit", function (e) {
    e.preventDefault();
    const $message = $("#updateProfileMessage");
    $message.addClass('d-none');
    
    $.ajax({
        url: 'api/update_profile.php',
        method: 'POST',
        data: {
            fullName: $("#accountFullName").val(),
            email: $("#accountEmail").val(),
            phone: $("#accountPhone").val(),
            address: $("#accountAddress").val(),
            birthdate: $("#accountBirthdate").val(),
            currentPassword: $("#accountCurrentPassword").val()
        },
        dataType: 'json',
        success: function(response) {
            $message.text(response.message).removeClass('d-none');
            if (response.status === 'success') {
                $message.removeClass('alert-danger').addClass('alert-success');
                // Atualiza o nome de usuário na navbar
                $userNamePlaceholder.text($("#accountFullName").val());
                 setTimeout(() => accountModal.hide(), 2000);
            } else {
                 $message.removeClass('alert-success').addClass('alert-danger');
            }
        },
        error: function() {
             $message.text('Erro de comunicação.').removeClass('d-none alert-success').addClass('alert-danger');
        }
    });
});


// 7. Ação para APAGAR CONTA
$("#btn-confirm-delete").on("click", function() {
    $.ajax({
        url: 'api/delete_account.php',
        method: 'POST',
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                deleteConfirmModal.hide();
                accountModal.hide();
                updateUserStatus(false); 
            } else {
                $("#deleteError").text(response.message).removeClass("d-none");
            }
        },
        error: function() {
            $("#deleteError").text("Erro de comunicação.").removeClass("d-none");
        }
    });
});

});